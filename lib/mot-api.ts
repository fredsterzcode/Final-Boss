// Mock MOT API utility functions
// Replace these with real DVSA API calls when you get access

export interface MOTData {
  make: string
  model: string
  mot_due: string
  registration: string
  mot_expiry?: string
  last_mot?: string
  mileage?: string
  fuel_type?: string
  colour?: string
}

/**
 * Mock MOT API function - replace with real DVSA API when available
 * @param registration Vehicle registration number
 * @returns Promise<MOTData>
 */
export const mockMOTApi = async (registration: string): Promise<MOTData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock data - replace with real API call
  const mockData: MOTData = {
    make: 'Ford',
    model: 'Focus',
    mot_due: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    registration: registration.toUpperCase(),
    mot_expiry: '2024-12-15',
    last_mot: '2023-12-15',
    mileage: '45,000',
    fuel_type: 'Petrol',
    colour: 'Blue'
  }
  
  return mockData
}

/**
 * Mock MOT API function for check example page
 * Returns data with MOT due in 30 days for demonstration
 */
export const mockMOTApiExample = async (registration: string): Promise<MOTData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock data with MOT due soon for demo purposes
  const mockData: MOTData = {
    make: 'Ford',
    model: 'Focus',
    mot_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    registration: registration.toUpperCase(),
    mot_expiry: '2024-12-15',
    last_mot: '2023-12-15',
    mileage: '45,000',
    fuel_type: 'Petrol',
    colour: 'Blue'
  }
  
  return mockData
}

/**
 * TODO: Replace with real DVSA MOT API
 * 
 * Example implementation structure:
 * 
 * export const realMOTApi = async (registration: string): Promise<MOTData> => {
 *   const response = await fetch(`${process.env.DVSA_API_URL}/mot/${registration}`, {
 *     headers: {
 *       'Authorization': `Bearer ${process.env.DVSA_API_KEY}`,
 *       'Content-Type': 'application/json'
 *     }
 *   })
 * 
 *   if (!response.ok) {
 *     throw new Error('Failed to fetch MOT data')
 *   }
 * 
 *   const data = await response.json()
 *   
 *   return {
 *     make: data.make,
 *     model: data.model,
 *     mot_due: data.motExpiryDate,
 *     registration: data.registrationNumber,
 *     // ... other fields
 *   }
 * }
 */
