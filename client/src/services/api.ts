const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function getHeaders(getIdToken: () => Promise<string | null>, user: any) {
  const token = await getIdToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Developer bypass headers for mock authentication
  if (user && user.uid) {
    headers['x-dev-user-id'] = user.uid;
    headers['x-dev-user-email'] = user.email || 'dev@example.com';
  }

  return headers;
}

export async function fetchDashboard(getIdToken: () => Promise<string | null>, user: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/user/dashboard`, { headers });
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchFootprints(getIdToken: () => Promise<string | null>, user: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/footprint`, { headers });
  if (!res.ok) throw new Error('Failed to fetch footprint logs');
  return res.json();
}

export async function createFootprint(getIdToken: () => Promise<string | null>, user: any, data: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/footprint`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to log carbon footprint');
  }
  return res.json();
}

export async function deleteFootprint(getIdToken: () => Promise<string | null>, user: any, id: string) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/footprint/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error('Failed to delete footprint log');
  return res.json();
}

export async function fetchChallenges(getIdToken: () => Promise<string | null>, user: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/user/challenges`, { headers });
  if (!res.ok) throw new Error('Failed to fetch challenges');
  return res.json();
}

export async function fetchAchievements(getIdToken: () => Promise<string | null>, user: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/user/achievements`, { headers });
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

export async function purchaseOffset(getIdToken: () => Promise<string | null>, user: any, data: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/offsets/purchase`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to purchase offsets');
  }
  return res.json();
}

export async function fetchOffsetsHistory(getIdToken: () => Promise<string | null>, user: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/offsets`, { headers });
  if (!res.ok) throw new Error('Failed to fetch offset history');
  return res.json();
}

export async function calculatePreview(data: any) {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Calculation preview failed');
  return res.json();
}
export async function updateProfile(getIdToken: () => Promise<string | null>, user: any, data: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function saveGoal(getIdToken: () => Promise<string | null>, user: any, data: any) {
  const headers = await getHeaders(getIdToken, user);
  const res = await fetch(`${API_BASE}/user/goals`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to save monthly goal');
  }
  return res.json();
}
