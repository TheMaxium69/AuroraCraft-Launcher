document.querySelector("#minimize").addEventListener("click", () => {
    ipc.send("manualMinimize");
});
document.querySelector("#close").addEventListener("click", () => {
    ipc.send("manualClose");
});