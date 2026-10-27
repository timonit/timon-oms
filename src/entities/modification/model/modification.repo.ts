import { Repo } from '@/shared/model/entity';
import type { Modification } from '@/shared/model/modification';

export class ModificationRepo extends Repo<Modification> {
  storage_name = 'modifications';

  getModifications(): Promise<Modification[]> {
    return this.getStorage();
  }

  async setModification(modifications: Modification[]) {
    await this.saveStorage(modifications);
  }
}
