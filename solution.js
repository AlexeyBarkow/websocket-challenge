window.addEventListener("load", () => {
    let auth_token;

    let task2 = {};

    let socket = new WebSocket("ws://localhost:8080");
    socket.binaryType = "arraybuffer";
    socket.onopen = function() {
        socket.send(JSON.stringify({ msg: "challenge_accepted", name: "DaQuirm" }));
    };

    socket.onmessage = function(evt) {
        if (typeof evt.data == "string") {
            let msg = JSON.parse(evt.data);
            switch (msg.msg) {
                case "auth":
                    auth_token = msg.auth_token;
                    socket.send(JSON.stringify({ msg: "task_one", auth_token }));
                    break;
                 case "compute":
                    let result;
                    switch (msg.operator) {
                        case '+':
                            result = msg.operands[0] + msg.operands[1];
                            break;
                        case '-':
                            result = msg.operands[0] - msg.operands[1];
                            break;
                        case '*':
                            result = msg.operands[0] * msg.operands[1];
                            break;
                    }
                    socket.send(JSON.stringify({ msg: "task_one_result", auth_token, result }));
                    break;
                case "win":
                    socket.send(JSON.stringify({ msg: "next", auth_token }));
                    break;

                case "binary_sum":
                    task2 = msg;
                    break;
            }
        } else {
            let result;
            let arrs = {
                8: Uint8Array,
                16: Uint16Array,
            }
            let arr = new arrs[task2.bits](evt.data);
            let sum = 0;
            for (let i = 0; i < arr.length; i++) {
                sum += arr[i];
            }
            result = sum;
            socket.send(JSON.stringify({ msg: "task_two_result", auth_token, result }));
        }
    }
});
