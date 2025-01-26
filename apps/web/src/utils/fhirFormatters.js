export function formatPatientName(name) {
  if (!name || !Array.isArray(name)) return 'Unknown';
  const primaryName = name.find(n => n.use === 'official') || name[0];
  return [
    primaryName.prefix?.join(' '),
    primaryName.given?.join(' '),
    primaryName.family
  ].filter(Boolean).join(' ');
}

export function formatCodeableConcept(concept) {
  if (!concept) return 'Unknown';
  if (concept.text) return concept.text;
  if (concept.coding?.[0]) {
    return concept.coding[0].display || concept.coding[0].code;
  }
  return 'Unknown';
}

export function formatQuantity(quantity) {
  if (!quantity) return '';
  return `${quantity.value} ${quantity.unit || quantity.code || ''}`.trim();
}

export function formatPeriod(period) {
  if (!period) return '';
  const start = period.start ? formatDate(period.start) : '';
  const end = period.end ? formatDate(period.end) : 'Present';
  return `${start} - ${end}`;
}

export function formatReference(reference) {
  if (!reference) return '';
  const parts = reference.split('/');
  return {
    type: parts[0],
    id: parts[1],
    display: reference.display || `${parts[0]}/${parts[1]}`
  };
} 