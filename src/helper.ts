import { base, pl, fr, en } from "@faker-js/faker";
import { Faker, faker, fakerFR, fakerPL } from "@faker-js/faker";

export interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  city: string;
  street: string;
  house: string;
  phone: string;
}

export type Region = "en" | "fr" | "pl" | "random";

export const randomLocaleGenerator = new Faker({
  locale: [pl, fr, en, base],
});

function insertRandomError(text: string, generator: Faker): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = text;

  const errorType = generator.number.int(3); // 3 types of errors
  const position = generator.number.int(result.length);

  switch (errorType) {
    case 0: {
      // Delete character
      result = result.slice(0, position) + result.slice(position + 1);
      break;
    }
    case 1: {
      // Insert random character
      const randomChar = alphabet[faker.number.int(alphabet.length)];
      result = result.slice(0, position) + randomChar + result.slice(position);
      break;
    }
    case 2:
      {
        // Swap characters
        if (position < result.length - 1) {
          result =
            result.slice(0, position) +
            result[position + 1] +
            result[position] +
            result.slice(position + 2);
        }
      }
      break;
  }

  return result;
}

export function createRandomUser(generator: Faker): User {
  return {
    id: generator.string.uuid(),
    firstName: generator.person.firstName("male"),
    middleName: generator.person.middleName("male"),
    lastName: generator.person.lastName("male"),
    country: generator.location.country(),
    street: generator.location.street(),
    house: generator.location.buildingNumber(),
    phone: generator.phone.number(),
    city: generator.location.city(),
  };
}

export function makeUserContainErrors(
  user: User,
  generator: Faker,
  errorCount: number
): User {
  const userFields = [
    "firstName",
    "middleName",
    "lastName",
    "country",
    "city",
    "street",
    "phone",
  ] as const;

  // user will container errorCount amount of errors
  for (let index = 0; index < errorCount; index++) {
    const fieldToErrorify = faker.helpers.arrayElement(userFields);

    user[fieldToErrorify] = insertRandomError(user[fieldToErrorify], generator);
  }

  return user;
}

export function createRandomUsers(
  count: number,
  region: Region,
  seed: number,
  page: number,
  errorCount: number
): User[] {
  const MAX_ERROR_COUNT = 10;
  if (errorCount > MAX_ERROR_COUNT || errorCount < 0) {
    throw Error(
      `Invalid error count. it should be between 0-${MAX_ERROR_COUNT}. give value: ${errorCount}`
    );
  }

  const generator =
    region === "en"
      ? faker
      : region === "fr"
        ? fakerFR
        : region === "pl"
          ? fakerPL
          : randomLocaleGenerator;

  // Seed the faker
  generator.seed(seed + page);

  const users = Array.from({ length: count }, () =>
    createRandomUser(generator)
  );

  const wholeErrorcount = Math.floor(errorCount)
  const errorProb = errorCount % 1



  const usersToContainErrors = users
    .map((eachU, index) => [eachU, index] as const)
    .filter(() => (errorProb === 0) || (errorProb > 0 && generator.number.float() < errorProb));

  const usersWithErrors = usersToContainErrors.map(
    (tuple) =>
      [
        makeUserContainErrors(tuple[0], generator, wholeErrorcount),
        tuple[1],
      ] as const
  );

  for (const userWithErrorAndOriginalIndexTuple of usersWithErrors) {
    const [userWithError, originalIndex] = userWithErrorAndOriginalIndexTuple;

    users[originalIndex] = userWithError;
  }

  return users;
}
