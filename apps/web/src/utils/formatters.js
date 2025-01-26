export const formatPatientName = (names) => {
  if (!names || !names.length) return 'Unknown';
  const primaryName = names.find(n => n.use === 'official') || names[0];
  const given = primaryName.given ? primaryName.given.join(' ') : '';
  const family = primaryName.family || '';
  return `${given} ${family}`.trim() || 'Unknown';
};

export const formatPatientIdentifier = (identifiers) => {
  if (!identifiers || !identifiers.length) return 'No ID';
  const primaryId = identifiers.find(id => 
    id.system?.toLowerCase().includes('mrn') || 
    id.type?.coding?.some(coding => coding.code === 'MR')
  ) || identifiers[0];
  return primaryId.value || 'No ID';
}; 