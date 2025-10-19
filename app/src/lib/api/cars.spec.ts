import { test, expect } from '@playwright/test';

// Car CRUD

test.describe('Car CRUD', () => {
  test('should create, view, and delete a car', async ({ request }) => {
    // Create
    const createRes = await request.post('/api/car', {
      data: {
        name: 'Test Car',
        weight: '5.0',
        year: 2025,
        racerId: 1,
        image: '',
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const car = await createRes.json();
    expect(car.name).toBe('Test Car');

    // View
    const viewRes = await request.get(`/api/car/${car.id}`);
    expect(viewRes.ok()).toBeTruthy();
    const carView = await viewRes.json();
    expect(carView.id).toBe(car.id);

    // Delete
    const deleteRes = await request.delete(`/api/car/${car.id}`);
    expect(deleteRes.ok()).toBeTruthy();
  });
});

// Racer CRUD

test.describe('Racer CRUD', () => {
  test('should create, view, update, and delete a racer', async ({ request }) => {
    // Create
    const createRes = await request.post('/api/racer', {
      data: {
        name: 'Test Racer',
        den: 'Test Den',
        rank: 'Test Rank',
        role: 'racer',
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const racer = await createRes.json();
    expect(racer.name).toBe('Test Racer');

    // View
    const viewRes = await request.get(`/api/racer/${racer.id}`);
    expect(viewRes.ok()).toBeTruthy();
    const racerView = await viewRes.json();
    expect(racerView.id).toBe(racer.id);

    // Update
    const updateRes = await request.patch(`/api/racer/${racer.id}`, {
      data: { name: 'Updated Racer' },
    });
    expect(updateRes.ok()).toBeTruthy();
    const updatedRacer = await updateRes.json();
    expect(updatedRacer.name).toBe('Updated Racer');

    // Delete
    const deleteRes = await request.delete(`/api/racer/${racer.id}`);
    expect(deleteRes.ok()).toBeTruthy();
  });
});