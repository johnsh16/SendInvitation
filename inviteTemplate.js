class Invite {
    constructor(name, email, date) {
        this.name = name
        this.email = email
        this.date = date
    }

    render () {
        return (
            <body>
                <h1>You are invited!</h1>
                <h3>Thank you for your interest in attending the Educational Event of 2022.</h3>s
            </body>
        )
    }
}