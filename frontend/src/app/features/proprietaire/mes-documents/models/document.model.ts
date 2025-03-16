export type DocumentType = 'CONTRAT' | 'FACTURE' | 'QUITTANCE' | 'AUTRE';

export interface IDocument {
  id: number;
  nom: string;
  type: DocumentType;
  date: string;
  taille: number;
  proprietaireId: number;
  immeubleId: number;
  url?: string;
}

export interface DocumentUpload {
  file: File;
  type: DocumentType;
  proprietaireId: number;
} 