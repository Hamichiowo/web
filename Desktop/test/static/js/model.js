// 你的 Teachable Machine 模型的連結
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// 加載影像模型並設置攝像頭
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // 加載模型與元數據
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // 設置攝像頭
    const flip = true; // 是否翻轉攝像頭
    webcam = new tmImage.Webcam(200, 200, flip); // 寬度, 高度, 翻轉
    await webcam.setup(); // 請求攝像頭訪問權限
    await webcam.play();
    window.requestAnimationFrame(loop);

    // 將攝像頭元素添加到 DOM 中
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // 添加分類標籤
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // 更新攝像頭畫面
    await predict();
    window.requestAnimationFrame(loop);
}

// 將攝像頭影像傳入模型進行預測
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
