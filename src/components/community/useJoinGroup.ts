import { useApp } from '../../state/AppContext';
import { usePlan } from '../../state/usePlan';
import { useUI } from '../UIProvider';
import type { Group } from '../../data/community';

/**
 * Entrar/sair de um grupo respeitando o plano: grupos exclusivos pedem Plus
 * e o Gratuito participa de até 20 grupos. Devolve `true` se a pessoa ficou no grupo.
 */
export function useJoinGroup() {
  const { state, toggleIn } = useApp();
  const { toast } = useUI();
  const { canJoinGroup, hasExclusiveGroups, limits, upsell } = usePlan();

  const locked = (g: Group) => !!g.exclusive && !hasExclusiveGroups;

  const toggle = (g: Group, opts: { silent?: boolean; welcome?: boolean } = {}) => {
    const joined = state.joinedGroups.includes(g.id);
    if (joined) {
      toggleIn('joinedGroups', g.id);
      if (!opts.silent) toast(`Você saiu de "${g.name}"`);
      return false;
    }
    if (locked(g)) {
      upsell('Grupo exclusivo do Plus', `"${g.name}" é uma roda menor, com mediação, para famílias apoiadoras. Faz parte do Plus e do Premium, junto com o selo de apoiador(a).`);
      return false;
    }
    if (!canJoinGroup) {
      upsell(`Você já está em ${limits.groups} grupos`, `O plano Gratuito participa de até ${limits.groups} grupos ao mesmo tempo. Saia de um grupo ou conheça o Plus, sem limite de grupos.`);
      return false;
    }
    toggleIn('joinedGroups', g.id);
    if (!opts.silent) toast(opts.welcome ? `Bem-vinda(o) a "${g.name}"!` : `Você entrou em "${g.name}"`);
    return true;
  };

  return { toggle, locked };
}
