export class JwtResponse {

    constructor(
        public token: string,
        public role: string,
        public expires:	number,

    ){};
}