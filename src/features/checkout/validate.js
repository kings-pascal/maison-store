export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Nigeria',
]

export const FIELD_ORDER = ['email', 'fullName', 'address', 'city', 'postalCode', 'country']

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export function validateCheckout(values) {
  const errors = {}

  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address'
  if (values.fullName.trim().length < 2) errors.fullName = 'Enter your full name'
  if (values.address.trim().length < 5) errors.address = 'Enter your street address'
  if (values.city.trim().length < 2) errors.city = 'Enter your city'
  if (values.postalCode.trim().length < 3) errors.postalCode = 'Enter your postal code'
  if (!values.country) errors.country = 'Select your country'

  return errors
}