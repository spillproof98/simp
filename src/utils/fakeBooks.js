import { faker } from "@faker-js/faker";

const genres = [
  "Fiction","Non-Fiction","Sci-Fi","Fantasy","Romance",
  "Mystery","Biography","Self-Help","History"
];

export function generateFakeBooks(n = 10000) {
  return Array.from({ length: n }).map(() => ({
    Title: faker.lorem.words(faker.number.int({ min: 2, max: 6 })),
    Author: faker.person.fullName(),
    Genre: faker.helpers.arrayElement(genres),
    PublishedYear: faker.number.int({ min: 1900, max: 2025 }).toString(),
    ISBN: faker.string.numeric(13),
  }));
}
