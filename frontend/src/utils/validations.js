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

    slug: {
        required: "Workspace URL is required",

        minLength: {
            value: 3,
            message: "Must be at least 3 characters",
        },

        maxLength: {
            value: 50,
            message: "Cannot exceed 50 characters",
        },

        validate: (value) => {
            if (!/^[a-z0-9-]+$/.test(value)) {
                return "Use lowercase letters, numbers and hyphens only";
            }

            if (value.startsWith("-")) {
                return "Cannot start with a hyphen";
            }

            if (value.endsWith("-")) {
                return "Cannot end with a hyphen";
            }

            if (value.includes("--")) {
                return "Cannot contain consecutive hyphens";
            }

            return true;
        },
    },
}

