function formatCNPJ(value: string) {
    value = value.replace(/\D/g, "");

    if (value.length !== 14) {
        throw new Error(`"${value}" cannot be formatted in CNPJ`);
    }

    return value.split("").reduce((formattedCnpj, char, i) => {
        // XX.XXX.XXX/0001-XX

        if (i >= 8 && i <= 10) {
            char = "0";
        }

        if (i === 11) {
            char = char === "2" ? char : "1";
        }

        if ([1, 4].includes(i)) {
            return formattedCnpj + char + ".";
        }

        if (i === 7) {
            return formattedCnpj + char + "/";
        }

        if (i === 11) {
            return formattedCnpj + char + "-";
        }

        return formattedCnpj + char;
    }, "");
}

export default formatCNPJ;
export { formatCNPJ };
