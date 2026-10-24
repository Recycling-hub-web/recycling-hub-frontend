// Mirrors apps.claims.models.Vehicle (VehicleSerializer) on the backend —
// the fleet vehicle a driver's petrol claim auto-resolves to. One vehicle
// per driver is enforced server-side (assigned_driver is a OneToOneField);
// this feature doesn't re-implement that check client-side — see
// constants.ts/CreateVehicleView for how a duplicate assignment surfaces.
type VehicleType = 'car' | 'motorbike' | 'van';
type Ownership = 'company' | 'personal';

type Vehicle = {
  id: string;
  plate_number: string;
  vehicle_type: VehicleType;
  ownership: Ownership;
  /** A DriverProfile id, or null when unassigned. Writable. */
  assigned_driver: string | null;
  /** Read-only display label for `assigned_driver` — the backend
   * resolves it from assigned_driver.user.full_name. */
  assigned_driver_name: string | null;
  has_fleet_card: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type { Ownership, Vehicle, VehicleType };
