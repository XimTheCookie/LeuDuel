# Release Guide

> Kindly notice that this is an Hobby project

---

## Generate the Upload Keystore

Run this once to generate the upload keystore in `./keys/`:

```bat
generate-keystore.bat
```

You'll be asked for your name/org/location and a password. The alias is pre-set to `leuduel`.

> **Back up `keys/leuduel-upload.jks` and your password somewhere safe. Losing it means contacting Google Play support to recover.**

---

## Create `release.env`

Create a `release.env` file at the repo root:

```env
KEYSTORE_HOST_PATH=./keys/leuduel-upload.jks
KEYSTORE_PASSWORD=your_password
KEY_ALIAS=leuduel
KEY_PASSWORD=your_password
```

Use the same password for both.

---

## Build & Upload

```bat
build-android-release.bat
```

Output AAB will be at:

```
output/leuduel-release.aab
```

Upload it on Google Play Console under **Release → Production → Create new release**.

> On the first upload Google will register your upload key. After that every upload must be signed with the same key.

---

## Versioning

1. Bump `versionCode` and `versionName` in `leuduel-app/android/app/build.gradle` and `APP_VERSION` in `leuduel-app/src/app/app.config.ts`
2. Run `build-android-release.bat`
3. Upload `output/leuduel-release.aab` to Google Play Console
