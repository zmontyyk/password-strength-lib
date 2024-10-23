export type StrengthIndicator = {
  score: number;
  strengthText: string;
  flag: boolean;
  errorMessage: string;
  index: number;
  lastPassword: string;
};

export const checkPasswordStrength = (
  password: string,
  name: string,
  email: string
): StrengthIndicator => {
  const strengthIndicator: StrengthIndicator = {
    score: 0,
    strengthText: '',
    flag: false,
    errorMessage: '',
    index: 0,
    lastPassword: password,
  };

  if (password.length >= 8) strengthIndicator.score += 1;
  if (password.length >= 12) strengthIndicator.score += 2;
  if (password.length >= 16) strengthIndicator.score += 3;

  const conditions = [
    /[a-z]/,
    /[A-Z]/,
    /[0-9]/,
    /[!,%,&,@,#,$,^,*,?,_,~,<,>,]/,
  ] as const;

  conditions.forEach((condition) => {
    if (condition.test(password)) {
      strengthIndicator.score += 1;
    }
  });

  if (hasUserNameOrEmail(name, password)) {
    strengthIndicator.errorMessage =
      'Password must not contain part of your name.';
    strengthIndicator.flag = true;
    strengthIndicator.score = 0;
    return strengthIndicator;
  }

  if (hasUserNameOrEmail(email, password)) {
    strengthIndicator.errorMessage =
      'Password must not contain part of your email.';
    strengthIndicator.flag = true;
    strengthIndicator.score = 0;
    return strengthIndicator;
  }

  const repeatedSequenceRegex = /(.)\1{2,}/;
  if (repeatedSequenceRegex.test(password)) {
    strengthIndicator.errorMessage =
      'Password contains repeated sequences of characters.';
    strengthIndicator.flag = true;
    return strengthIndicator;
  } else strengthIndicator.flag = false;

  if (hasIncrementingOrDecrementingSequence(password)) {
    strengthIndicator.errorMessage =
      'Password contains incrementing or decrementing sequences of characters.';
    strengthIndicator.flag = true;
    strengthIndicator.score = 0;
    return strengthIndicator;
  } else strengthIndicator.flag = false;

  if (strengthIndicator.score <= 2) {
    strengthIndicator.strengthText = 'Very Weak';
  } else if (strengthIndicator.score <= 4) {
    strengthIndicator.index = 1;
    strengthIndicator.strengthText = 'Weak';
  } else if (strengthIndicator.score <= 6) {
    strengthIndicator.strengthText = 'Fair';
    strengthIndicator.index = 2;
  } else if (strengthIndicator.score <= 8) {
    strengthIndicator.strengthText = 'Strong';
    strengthIndicator.index = 3;
  } else {
    strengthIndicator.strengthText = 'Very Strong';
    strengthIndicator.index = 4;
  }
  return strengthIndicator;
};

// check incrementing Or decrementing sequence
function hasIncrementingOrDecrementingSequence(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = password.charCodeAt(i);
    const char2 = password.charCodeAt(i + 1);
    const char3 = password.charCodeAt(i + 2);

    if (char1 + 1 === char2 && char2 + 1 === char3) {
      return true;
    }

    if (char1 - 1 === char2 && char2 - 1 === char3) {
      return true;
    }
  }

  return false;
}

// check password contain user name or email
function hasUserNameOrEmail(value: string, password: string): boolean {
  if (typeof value !== 'string' || value.length < 3 || value === '') {
    return false;
  }

  let partsOfThreeLetters: string[] = [];

  for (let i = 0; i < 3; i++) {
    const parts = value.substr(i).match(/.{3}/g);
    if (parts) {
      partsOfThreeLetters = partsOfThreeLetters.concat(parts);
    }
  }
  const regex = new RegExp(partsOfThreeLetters.join('|'), 'i');
  return regex.test(password);
}
