import { StorageEngine } from '../db/StorageEngine';
import { UserIdentityEntity, UserRole } from './types';

const INITIAL_USERS: UserIdentityEntity[] = [
  {
    id: 'usr-admin-001',
    username: 'admin',
    email: 'admin@pinova.network',
    roles: ['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-compliance-001',
    username: 'compliance_admin',
    email: 'compliance@pinova.network',
    roles: ['COMPLIANCE_ADMIN'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-bursar-001',
    username: 'school_bursar',
    email: 'bursar@unilag.edu.ng',
    roles: ['BURSAR', 'INSTITUTION_ADMIN'],
    institutionId: 'inst-unilag-001',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-admissions-001',
    username: 'admissions_officer',
    email: 'admissions@unilag.edu.ng',
    roles: ['ADMISSIONS_OFFICER'],
    institutionId: 'inst-unilag-001',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-parent-001',
    username: 'Pioneer_Parent_Kano',
    email: 'parent.kano@pioneer.network',
    roles: ['GUARDIAN'],
    guardianId: 'usr-parent-001',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-parent-secondary',
    username: 'parent_user',
    email: 'parent.user@pioneer.network',
    roles: ['GUARDIAN'],
    guardianId: 'usr-parent-secondary',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-student-001',
    username: 'student_aminu',
    email: 'aminu.kano@student.unilag.edu.ng',
    roles: ['STUDENT'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-seller-001',
    username: 'Nexus_Gadgets',
    email: 'nexus@merchants.pinova.network',
    roles: ['SELLER'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-explorer-001',
    username: 'Pioneer_Explorer',
    email: 'explorer@pioneer.network',
    roles: ['BUYER', 'GUARDIAN'],
    guardianId: 'usr-explorer-001',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export class UserIdentityRepository {
  private engine: StorageEngine<UserIdentityEntity>;

  constructor() {
    this.engine = new StorageEngine<UserIdentityEntity>('user_identities', 'id', INITIAL_USERS);
  }

  public findById(id: string): UserIdentityEntity | null {
    return this.engine.get(id);
  }

  public findByUsername(username: any): UserIdentityEntity | null {
    if (!username || typeof username !== 'string') return null;
    const clean = username.trim().toLowerCase();
    return this.engine.find((u) => u.username.toLowerCase() === clean);
  }

  public findByPiUid(piUid: string): UserIdentityEntity | null {
    return this.engine.find((u) => u.piUid === piUid);
  }

  public upsertUser(data: {
    username: string;
    piUid?: string;
    email?: string;
    roles?: UserRole[];
    institutionId?: string;
    guardianId?: string;
  }): UserIdentityEntity {
    const existing = this.findByUsername(data.username);
    const now = new Date().toISOString();

    if (existing) {
      const updated: UserIdentityEntity = {
        ...existing,
        piUid: data.piUid || existing.piUid,
        email: data.email || existing.email,
        institutionId: data.institutionId || existing.institutionId,
        guardianId: data.guardianId || existing.guardianId,
        // Server-side: do NOT overwrite roles with untrusted empty roles
        roles: data.roles && data.roles.length > 0 ? data.roles : existing.roles,
        updatedAt: now
      };
      this.engine.set(existing.id, updated);
      return updated;
    }

    const newUser: UserIdentityEntity = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username: data.username,
      piUid: data.piUid,
      email: data.email || `${data.username.toLowerCase()}@pioneer.network`,
      roles: data.roles && data.roles.length > 0 ? data.roles : ['PIONEER'],
      institutionId: data.institutionId,
      guardianId: data.guardianId,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    this.engine.set(newUser.id, newUser);
    return newUser;
  }

  public assignRole(username: string, role: UserRole): UserIdentityEntity | null {
    const user = this.findByUsername(username);
    if (!user) return null;

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      user.updatedAt = new Date().toISOString();
      this.engine.set(user.id, user);
    }
    return user;
  }

  public removeRole(username: string, role: UserRole): UserIdentityEntity | null {
    const user = this.findByUsername(username);
    if (!user) return null;

    user.roles = user.roles.filter((r) => r !== role);
    user.updatedAt = new Date().toISOString();
    this.engine.set(user.id, user);
    return user;
  }

  public getAll(): UserIdentityEntity[] {
    return this.engine.getAll();
  }
}
