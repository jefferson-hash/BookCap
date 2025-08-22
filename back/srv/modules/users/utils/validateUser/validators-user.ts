// Validar formato de email
const validateEmailFormat = (email: string): string | null => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  return null;
};

// Validar si el usuario ya existe
const validateExistingUser = async (
  email: string,
  Users: any,
): Promise<string | null> => {
  const user = await SELECT.one.from(Users).where({ email });
  if (user) {
    return "Email already exists";
  }
  return null;
};

// Validar contraseña
const validatePassword = (password: string): string | null => {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return null;
};

// Validar usuario completo
const validateUser = async (req: any, Users: any): Promise<string[]> => {
  const errors: string[] = [];
  const { email, password } = req.data;

  const emailFormatError = validateEmailFormat(email);
  if (emailFormatError) errors.push(emailFormatError);

  const existingUserError = await validateExistingUser(email, Users);
  if (existingUserError) errors.push(existingUserError);

  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);

  return errors;
};

export { validateUser };
