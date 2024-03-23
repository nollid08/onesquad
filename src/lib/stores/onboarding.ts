import storage from "./reusable"

interface Onboarding {
    image: File | undefined,
    name: string,
    country: string | undefined,
}

export const onboarding = storage<Onboarding>("oboarding", {
    image: undefined,
    name: "",
    country: undefined,
})

export { storage }
