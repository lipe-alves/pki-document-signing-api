function formatCPF(value: string) {
    value = value.replace(/\D/g, "");

    if (value.length !== 11) {
        throw new Error(`"${value}" cannot be formatted in CPF`);
    }

    return value.split("").reduce((formattedCpf, char, i) => {
        // XXX.XXX.XXX-XX

        if ([2, 5].includes(i)) {
            return formattedCpf + char + ".";
        }

        if (i === 8) {
            return formattedCpf + char + "-";
        }

        return formattedCpf + char;
    }, "");
}

export default formatCPF;
export { formatCPF };
