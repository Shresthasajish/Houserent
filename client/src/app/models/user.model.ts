export class User {
    _id: string;
    name: string;
    email: string;
    phone: number;
    password: string;
    gender: string;
    date_of_birth: Date;

    constructor(details: any) {

        this.name = details.name || "";
        this.email = details.email || "";
        this.phone = details.phone || "";
        this.gender = details.gender || "";
        this.password = details.password || "";
        this.date_of_birth = details.date_of_birth || "";
    }
}


