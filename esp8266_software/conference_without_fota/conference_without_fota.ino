#include <ESP8266WiFi.h>

String serialBuffer = "";
String latestData = "";

WiFiServer server(80);

const int led_1 = 4;
const int led_2 = 5;
const int DATA_BUFFER_LENGTH = 50;

boolean connectionTrigger = true;

void setup() {
  pinMode(led_1, OUTPUT);
  pinMode(led_2, OUTPUT);

  digitalWrite(led_1, 0);
  digitalWrite(led_2, 0);

  serialBuffer.reserve(DATA_BUFFER_LENGTH);
  latestData.reserve(DATA_BUFFER_LENGTH);

  Serial.begin(9600);

  WiFi.mode(WIFI_STA); // Station mode
  delay(1000); // Required

}

void connectByWPS() {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin("", ""); // Use stored values
    delay(4000); // Required
  }

  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(led_1, 1);
    digitalWrite(led_2, 1);

    connectionTrigger = true;
    Serial.println("\n[No connection]");

    WiFi.beginWPSConfig();
    delay(3000); // Required
  }

  if (connectionTrigger) {
    digitalWrite(led_1, 0);
    digitalWrite(led_2, 0);

    connectionTrigger = false;
    Serial.println("\n[Connected to: " + WiFi.SSID() + "; IP: " + WiFi.localIP() + "]");

    server.begin();
  }
}

void readSerial() {
  boolean dataFlag = false;

  while (Serial.available()) {
    dataFlag = true;
    digitalWrite(led_1, 1);

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

  if (dataFlag) digitalWrite(led_1, 0);
}

void sendCurrentData() {
  WiFiClient client = server.available();

  if (!client) return;
  boolean dataFlag = false;
  boolean readOnlyFirstLineFlag = true;

  digitalWrite(led_2, 1);
  Serial.println("\n[Client connected]");

  while (client.connected()) {
    if (!client.available()) continue;

    String line = client.readStringUntil('\r');
    Serial.println(line);

    if (line.indexOf("/data") != -1) {
      dataFlag = true;
    }

    if (dataFlag) {
      client.println(getHeaders() + getBody());
      break;
    }

    if (readOnlyFirstLineFlag && !dataFlag) {
      break;
    }
  }

  delay(5); // Required
  client.stop();
  client.flush();
  Serial.println("[Client connected]");
  digitalWrite(led_2, 0);
}

String getHeaders() {
  String headers = String("HTTP/1.1 200 OK\r\n") +
                          "Content-Type: application/json\r\n" +
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
