import { StorageEngine } from '../StorageEngine';
import { PstpDisputeEntity, DisputeComment, DisputeAdminResolution, DisputeEvidenceFile } from '../types';

const INITIAL_DISPUTES: PstpDisputeEntity[] = [
  {
    id: 'DSP-UUID-1001',
    orderId: 'ORD-PI-334110',
    buyerUsername: 'Pioneer_Explorer',
    sellerUsername: 'Nexus_Gadgets',
    reason: 'Damaged package upon delivery',
    description: 'The sealed parcel arrived with visible physical impact damage to the box outer shell. Screen cracked.',
    amountPi: 145.0,
    status: 'open',
    evidenceFiles: [
      {
        id: 'EVI-1',
        fileName: 'damaged_box_front.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80',
        fileType: 'image',
        uploadedBy: 'Pioneer_Explorer',
        uploadedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    comments: [
      {
        id: 'CMT-1',
        sender: 'Pioneer_Explorer',
        role: 'buyer',
        text: 'I received the package today at 2 PM. Photos attached show severe transit damage.',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'CMT-2',
        sender: 'Nexus_Gadgets',
        role: 'seller',
        text: 'We inspect all outgoing shipments with video logs. We have requested transit insurance claim from carrier.',
        timestamp: new Date(Date.now() - 43200000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString()
  }
];

export class PstpDisputeRepository {
  private engine: StorageEngine<PstpDisputeEntity>;

  constructor() {
    this.engine = new StorageEngine<PstpDisputeEntity>('pstp_disputes', 'id', INITIAL_DISPUTES);
  }

  public createDispute(disputeData: Omit<PstpDisputeEntity, 'id' | 'createdAt' | 'updatedAt' | 'evidenceFiles' | 'comments'> & { id?: string; evidenceFiles?: (DisputeEvidenceFile | string)[]; comments?: DisputeComment[] }): PstpDisputeEntity {
    const now = new Date().toISOString();
    const dispute: PstpDisputeEntity = {
      id: disputeData.id || `DSP-UUID-${Date.now()}`,
      orderId: disputeData.orderId,
      buyerUsername: disputeData.buyerUsername,
      sellerUsername: disputeData.sellerUsername,
      reason: disputeData.reason,
      description: disputeData.description,
      amountPi: Number(disputeData.amountPi) || 0,
      status: disputeData.status || 'open',
      evidenceFiles: (disputeData.evidenceFiles || []).map((file: any, idx: number) => {
        if (typeof file === 'string') {
          return {
            id: `ev-${Date.now()}-${idx}`,
            fileName: file.split('/').pop() || file,
            fileUrl: file,
            fileType: 'application/octet-stream',
            uploadedBy: disputeData.buyerUsername || 'buyer',
            uploadedAt: now
          };
        }
        return file as DisputeEvidenceFile;
      }),
      comments: disputeData.comments || [],
      createdAt: now,
      updatedAt: now
    };

    this.engine.unshift(dispute);
    return dispute;
  }

  public addComment(disputeId: string, comment: Omit<DisputeComment, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): PstpDisputeEntity | null {
    const dispute = this.engine.get(disputeId);
    if (!dispute) return null;

    const newComment: DisputeComment = {
      id: comment.id || `CMT-${Date.now()}`,
      sender: comment.sender,
      role: comment.role,
      text: comment.text,
      timestamp: comment.timestamp || new Date().toISOString()
    };

    dispute.comments.push(newComment);
    dispute.updatedAt = new Date().toISOString();
    if (comment.role === 'seller' && dispute.status === 'open') {
      dispute.status = 'seller_responded';
    }

    this.engine.set(disputeId, dispute);
    return dispute;
  }

  public resolveDispute(disputeId: string, resolution: DisputeAdminResolution): PstpDisputeEntity | null {
    const dispute = this.engine.get(disputeId);
    if (!dispute) return null;

    dispute.adminResolution = resolution;
    dispute.status = resolution.decision.includes('refund') ? 'resolved_refunded' : 'resolved_rejected';
    dispute.updatedAt = new Date().toISOString();

    this.engine.set(disputeId, dispute);
    return dispute;
  }

  public findById(id: string): PstpDisputeEntity | null {
    return this.engine.get(id);
  }

  public findByOrderId(orderId: string): PstpDisputeEntity[] {
    return this.engine.filter((d) => d.orderId === orderId);
  }

  public getAll(): PstpDisputeEntity[] {
    return this.engine.getAll();
  }

  public count(): number {
    return this.engine.count();
  }
}
