# --- GIAI ĐOẠN 1: BUILD ---
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml trước để cache dependencies (tránh tải lại khi code thay đổi)
COPY pom.xml .
RUN mvn dependency:resolve -B

# Copy source code và biên dịch thành file .jar (bỏ qua chạy thử test để build nhanh)
COPY src ./src
RUN mvn package -DskipTests

# --- GIAI ĐOẠN 2: RUN ---
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Chỉ lấy file .jar từ builder (GĐ1)
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Lệnh "bật công tắc" để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
