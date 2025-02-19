export function generateSecurePassword(): string {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';

  const allChars = lowerCase + upperCase + numbers + specialChars;

  let password = '';
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  for (let i = 0; i < 6; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*[a-zA-Z]).{10,16}$/;
  if (!passwordRegex.test(password)) {
    return generateSecurePassword();
  }

  return password;
}
