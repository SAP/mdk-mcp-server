import { FilterCriteria } from 'mdk-core/controls/IFilterable';

export default function SetFiltersFromString(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  if (sectionedTable) {
    if (clientAPI.getClientData().currentFiltersString) {
      Promise.resolve(alert('use current filters string')).then(() => {
        sectionedTable.filters = loadFiltersFromString(clientAPI.getClientData().currentFiltersString);
      });
    } else {
      Promise.resolve(alert('NO current filters string found, will use pre-select filters string')).then(() => {
        sectionedTable.filters = loadFiltersFromString(clientAPI.getClientData().preSelectFiltersString);
      });
    }
  }
}

function loadFiltersFromString(str) {
  let result = [];

  if (!str) {
    return result;
  }

  try {
    const items = JSON.parse(str);
    if (items && items.length && items.length > 0) {
      for (const item of items) {
        const filter = Object.assign(new FilterCriteria(), item);
        result.push(filter);
      }
    }
  } catch(e) {
    result = [];
    console.log(e);
  }

  return result;
}
