function isLocal() {
    return !process.env.NODE_ENV;
}

export default isLocal;
export { isLocal };
