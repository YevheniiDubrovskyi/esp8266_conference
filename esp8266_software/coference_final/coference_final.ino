#include <ESP8266WiFi.h>

String serialBuffer = "";
String latestData = "";

WiFiServer server(80);

const int LED_RGY_4 = 4;
const int LED_RGY_5 = 5;
const int LED_Y_WiFi = 12;
const int LED_Y_COM = 13;
const int LED_G__POWER = 16;
const int LED_R = 14;

const int DATA_BUFFER_LENGTH = 50;

boolean connectionTrigger = true;

void setYellowRGY() {
  digitalWrite(LED_RGY_4, 0);
  digitalWrite(LED_RGY_5, 0);
}

void setGreenRGY() {
  digitalWrite(LED_RGY_4, 1);
  digitalWrite(LED_RGY_5, 0);
}

void setRedRGY() {
  digitalWrite(LED_RGY_4, 0);
  digitalWrite(LED_RGY_5, 1);
}

void setNullRGY() {
  digitalWrite(LED_RGY_4, 1);
  digitalWrite(LED_RGY_5, 1);
}

void setup() {
  pinMode(LED_RGY_4, OUTPUT);
  pinMode(LED_RGY_5, OUTPUT);
  pinMode(LED_Y_WiFi, OUTPUT);
  pinMode(LED_Y_COM, OUTPUT);
  pinMode(LED_G__POWER, OUTPUT);
  pinMode(LED_R, OUTPUT);

  setNullRGY();
  digitalWrite(LED_Y_WiFi, 0);
  digitalWrite(LED_Y_COM, 0);
  digitalWrite(LED_G__POWER, 0);
  digitalWrite(LED_R, 0);

  serialBuffer.reserve(DATA_BUFFER_LENGTH);
  latestData.reserve(DATA_BUFFER_LENGTH);

  Serial.begin(9600);

  WiFi.mode(WIFI_STA); // Station mode
  delay(1000); // Required
}

void connectByWPS() {
  if (WiFi.status() != WL_CONNECTED) {
    setRedRGY();
    WiFi.begin("", ""); // Use stored values
    delay(4000); // Required

    if (WiFi.status() == WL_CONNECTED) {
      connectionTrigger = true;
    }
  }

  while (WiFi.status() != WL_CONNECTED) {
    setRedRGY();

    connectionTrigger = true;
    Serial.println("\n[No connection]");

    WiFi.beginWPSConfig();
    delay(3000); // Required
  }

  if (connectionTrigger) {
    setYellowRGY();

    connectionTrigger = false;
    Serial.println("\n[Connected to: " + WiFi.SSID() + "; IP: " + WiFi.localIP() + "]");

    server.begin();
  }
}

void readSerial() {
  boolean dataFlag = false;

  while (Serial.available()) {
    dataFlag = true;
    digitalWrite(LED_Y_COM, 1);

    if (serialBuffer.length() >= DATA_BUFFER_LENGTH) {
      serialBuffer = "";
    }

    char inputChar = (char)Serial.read();
    serialBuffer += inputChar;

    if (inputChar == '\n') {
      if (serialBuffer.length() > 2) latestData = serialBuffer;
      serialBuffer = "";
    }
  }

  if (dataFlag) digitalWrite(LED_Y_COM, 0);
}

void sendCurrentData() {
  WiFiClient client = server.available();

  if (!client) return;
  boolean dataFlag = false;
  boolean readOnlyFirstLineFlag = true;

  setGreenRGY();
  Serial.println("\n[Client connected]");

  while (client.connected()) {
    if (!client.available()) continue;
    digitalWrite(LED_Y_WiFi, 1);

    String line = client.readStringUntil('\r');
    Serial.println(line);

    if (line.indexOf("/data") != -1) {
      dataFlag = true;
    }

    if (line.indexOf("/power") != -1) {
      if (line.indexOf("/on") != -1) {
        digitalWrite(LED_G__POWER, 1);
      } else if (line.indexOf("/off") != -1) {
        digitalWrite(LED_G__POWER, 0);
      }
      break;
    }

    if (dataFlag) {
      client.println(getHeaders(true) + getBody());
      break;
    }

    if (readOnlyFirstLineFlag && !dataFlag) {
      client.println(getHeaders(false));
      break;
    }

    digitalWrite(LED_Y_WiFi, 0);
  }

  delay(5); // Required
  client.stop();
  client.flush();
  Serial.println("[Client disconnected]");
  setYellowRGY();
}

String getHeaders(boolean JSONFlag) {
  String optionalJSON;
  if (JSONFlag) {
    optionalJSON = String("Content-Type: application/json\r\n");
  } else {
    optionalJSON = "";
  }

  String headers = String("HTTP/1.1 200 OK\r\n") +
                          optionalJSON +
                          "Unit-Type: esp8266\r\n" +
                          "Connection: close\r\n" +
                          "\r\n";

  return headers;
}

String getBody() {
  String body = String("{\"data\":\"") + latestData + "\"}";

  return body;
}

void loop() {
  connectByWPS();
  readSerial();
  sendCurrentData();
}
