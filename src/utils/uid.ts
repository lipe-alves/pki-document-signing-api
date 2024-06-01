import randomInterval from "./randomInterval";

function uid(prefix = "uid-") {
    let a = Math.ceil(Math.random() * 100000000000).toString(32);
    let b = new Date().getTime().toString(32);
    let c = Math.ceil(Math.random() * (32 - 28) + 28);
    let d = prefix + a + b + c;
    const length = d.length;

    for (let i = 0; i < length - 5; i++) {
        let index = randomInterval(0, length);

        d =
            d.substr(0, index) +
            d.substr(index, 1).toUpperCase() +
            d.substr(index + 1);
    }

    return d;
}

export default uid;
export { uid };
