import { getUserByEmail } from "../db/users";

describe('getUserByEmail', () => {
    test('should return user for existing email', async () => {
        const userEmail = 'stephane.andre85@gmail.com';
        const user = await getUserByEmail(userEmail);
        expect(user).toBeDefined();
        expect(user.email).toBe(userEmail);
    });

    test('should return null for non-existing email', async () => {
        const userEmail = 'nonexisting@example.com';
        const user = await getUserByEmail(userEmail);
        expect(user).toBeNull();
    });
});