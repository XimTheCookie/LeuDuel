FROM eclipse-temurin:21-jdk-noble

# --- Node 24 ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# --- Android SDK ---
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${PATH}"

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    curl -sSL https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip -o /tmp/cmdtools.zip && \
    unzip -q /tmp/cmdtools.zip -d /tmp/cmdtools && \
    mv /tmp/cmdtools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm -rf /tmp/cmdtools /tmp/cmdtools.zip

RUN yes | sdkmanager --licenses > /dev/null && \
    sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"

# --- Angular CLI ---
RUN npm install -g @angular/cli@22.1.8

WORKDIR /workspace/leuduel-app
