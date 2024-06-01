import { Database } from "../services";
import { Token } from "../models";

class TokensDatabase extends Database<Token> {
    constructor() {
        super("tokens");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new Token(data));
    }

    public override watch(listener: (tokens: Token[]) => void) {
        return super.watch((list) => {
            const tokens = list.map((data) => new Token(data));
            listener(tokens);
        });
    }
}

export default TokensDatabase;
export { TokensDatabase };
