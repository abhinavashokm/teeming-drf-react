export const validations = {
    fullName: {
        required: "Full name is required",

        minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
        },

        pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "Only letters are allowed",
        },
    },

    email: {
        required: "Email is required",

        pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
        },
    },

    password: {
        required: "Password is required",

        minLength: {
            value: 8,
            message: "Minimum 8 characters",
        },
    },
}