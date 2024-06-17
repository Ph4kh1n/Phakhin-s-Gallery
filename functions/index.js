const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();

exports.generateLowQualityImage = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const fileName = path.basename(filePath);
  const folderPath = path.dirname(filePath);
  const lowQualityFolder = "low_quality_images"; // โฟลเดอร์สำหรับภาพคุณภาพต่ำ
  const lowQualityFilePath = path.join(lowQualityFolder, folderPath, fileName);

  const bucket = admin.storage().bucket(object.bucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const lowQualityTempFilePath = path.join(os.tmpdir(), `low-${fileName}`);

  const metadata = {
    contentType: object.contentType,
  };

  if (!object.contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return null;
  }

  await bucket.file(filePath).download({ destination: tempFilePath });

  await sharp(tempFilePath)
    .resize(100, 100) // ปรับขนาดรูปภาพ
    .jpeg({ quality: 10 }) // ตั้งค่าคุณภาพของภาพ
    .toFile(lowQualityTempFilePath);

  await bucket.upload(lowQualityTempFilePath, {
    destination: lowQualityFilePath,
    metadata: metadata,
  });

  fs.unlinkSync(tempFilePath);
  fs.unlinkSync(lowQualityTempFilePath);

  return null;
});
