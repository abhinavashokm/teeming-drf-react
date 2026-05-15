export const validations = {
    fullName: {
        required: "Full name is required",

        minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
        },

        pattern: {
            value: /^(?!\s*$)[A-Za-z\s]+$/,
            message: "Only letters are allowed",
        },
    },

    email: {
        required: "Email is required",

        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email",
        },
    },

    password: {
        required: "Password is required",

        minLength: {
            value: 8,
            message: "Minimum 8 characters",
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            message: "Must include uppercase, lowercase and number",
        },
    },
}