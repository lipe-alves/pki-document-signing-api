function randomInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default randomInterval;
export { randomInterval };
