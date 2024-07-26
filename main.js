let patientHLAGenes = [];

let data = [];

let donorKIRgenes = {
  '2DS2': 0, // OK
  '2DL2': 0, // OK
  '2DL3': 0, // OK
  '2DP1': 0,
  '2DL1': 0, // OK
  '3DL1': 0, // OK
  '2DS4': 0,
  '3DS1': 0, // OK
  '2DS1': 0,
  '2DL5': 0,
  '2DS3': 0,
  '2DS5': 0,
  '3DL3': 1,
  '3DP1': 1,
  '2DL4': 1,
  '3DL2': 1, // OK
};

function process() {

  const A0311 = patientHLAGenes.filter(gene => gene.ligand === 'A3' || gene.ligand === 'A11');
  const A0311names = A0311.map(gene => gene.name);

  const Bw4 = patientHLAGenes.filter(gene => gene.ligand && gene.ligand.startsWith('Bw4'));
  const Bw4names = Bw4.map(gene => gene.name);

  const C1 = patientHLAGenes.filter(gene => gene.ligand && gene.ligand.startsWith('C1'));
  const C1names = C1.map(gene => gene.name);

  const C2 = patientHLAGenes.filter(gene => gene.ligand && gene.ligand.startsWith('C2'));
  const C2names = C2.map(gene => gene.name);

  // References to the HTML elements for activating and inhibitory results
  const activatingContainer = document.getElementById('activating');
  const inhibitoryContainer = document.getElementById('inhibitory');

  // Clear previous results
  activatingContainer.innerHTML = '';
  inhibitoryContainer.innerHTML = '';

  // Helper function to add results to the page
  const addResult = (container, text) => {
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);
  };

  // Activating interactions
  if (donorKIRgenes['3DS1'] == 1 && Bw4names.length > 0) {
    addResult(activatingContainer, `3DS1 + ${Bw4names.join(', ')}`);
  }
  if (donorKIRgenes['2DS2'] == 1 && C1names.length > 0) {
    addResult(activatingContainer, `2DS2 + ${C1names.join(', ')}`);
  }
  if (donorKIRgenes['2DS1'] == 1 && C2names.length > 0) {
    addResult(activatingContainer, `2DS1 + ${C2names.join(', ')}`);
  }

  // Inhibitory interactions
  if (donorKIRgenes['3DL2'] == 1 && A0311.length > 0) {
    addResult(inhibitoryContainer, `3DL2 + ${A0311names.join(', ')}`);
  }
  if (donorKIRgenes['3DL1'] == 1 && Bw4names.length > 0) {
    addResult(inhibitoryContainer, `3DL1 + ${Bw4names.join(', ')}`);
  }
  if (donorKIRgenes['2DL2'] == 1 && C1names.length > 0) {
    addResult(inhibitoryContainer, `2DL2 + ${C1names.join(', ')}`);
  }
  if (donorKIRgenes['2DL3'] == 1 && C1names.length > 0) {
    addResult(inhibitoryContainer, `2DL3 + ${C1names.join(', ')}`);
  }
  if (donorKIRgenes['2DL1'] == 1 && C2names.length > 0) {
    addResult(inhibitoryContainer, `2DL1 + ${C2names.join(', ')}`);
  }

  // Show the results container
  document.getElementById('results').style.display = 'flex';
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

 function updateHLA() {
  patientHLAGenes = [];
  const geneA1 = getRandomElement(data.A);
  const geneB1 = getRandomElement(data.B);
  const geneC1 = getRandomElement(data.C);

  const geneA2 = getRandomElement(data.A);
  const geneB2 = getRandomElement(data.B);
  const geneC2 = getRandomElement(data.C);

  // Update HTML elements with the name field
  document.getElementById("hla-a-row1").textContent = geneA1.name;
  document.getElementById("hla-b-row1").textContent = geneB1.name;
  document.getElementById("hla-c-row1").textContent = geneC1.name;
  document.getElementById("hla-a-row2").textContent = geneA2.name;
  document.getElementById("hla-b-row2").textContent = geneB2.name;
  document.getElementById("hla-c-row2").textContent = geneC2.name;

  patientHLAGenes.push(
    {
      ligand: geneA1.ligand,
      name: geneA1.name
    },
    {
      ligand: geneA2.ligand,
      name: geneA2.name
    }
  );

  patientHLAGenes.push(
    {
      ligand: geneB1.ligand,
      name: geneB1.name
    },
    {
      ligand: geneB2.ligand,
      name: geneB2.name
    }
  );

  patientHLAGenes.push(
    {
      ligand: geneC1.ligand,
      name: geneC1.name
    },
    {
      ligand: geneC2.ligand,
      name: geneC2.name
    }
  );

  console.log(patientHLAGenes);

}

function updateHLAgene(element, HLA, number) {
    const inputElement = document.getElementById(element);
    const currentValue = inputElement.textContent;
    console.log(HLA, number);
    patientHLAGenes[HLA][number] = currentValue;
    console.log("Current input:", currentValue);
}

function updateKIRgene(checkbox) {
  const gene = checkbox.id;
  donorKIRgenes[gene] = checkbox.checked ? 1 : 0;
  console.log(donorKIRgenes);
}

function updateKIR() {
  const kirGenes = [
      '2DS2', '2DL2', '2DL3', '2DP1', '2DL1', '3DL1', 
      '2DS4', '3DS1', '2DL5', '2DS3', '2DS5'
  ];
  kirGenes.forEach(gene => {
      const checkbox = document.getElementById(gene);
      const isChecked = Math.random() < 0.5;
      checkbox.checked = isChecked;
      donorKIRgenes[gene] = isChecked ? 1 : 0;
  });

  const frameworkGenes = ['3DL3', '3DP1', '2DL4', '3DL2'];
  frameworkGenes.forEach(gene => {
      const checkbox = document.getElementById(gene);
      checkbox.checked = true;
      donorKIRgenes[gene] = 1;
  });

  console.log(donorKIRgenes);
}

async function fetchAllData(url) {
  let categorizedData = {
      A: [],
      B: [],
      C: []
  };
  let nextUrl = url;
  let totalItems = 0;
  let fetchedItems = 0;

  // Initial API call to get the total number of items and first batch of data
  try {
      const initialResponse = await fetch(nextUrl);
      if (!initialResponse.ok) {
          throw new Error(`HTTP error! status: ${initialResponse.status}`);
      }

      const initialData = await initialResponse.json();
      totalItems = initialData.meta.total || 0;

      // Categorize the data based on the name prefix
      const categorizedBatch = categorizeData(initialData.data);
      categorizedData = mergeCategorizedData(categorizedData, categorizedBatch);
      fetchedItems += initialData.data.length;
      updateProgressBar(fetchedItems, totalItems);
      nextUrl = initialData.meta.next ? `https://www.ebi.ac.uk/cgi-bin/ipd/api/allele${initialData.meta.next}` : null;

  } catch (error) {
      console.error('Error fetching initial data:', error);
      return;
  }

  // Fetch the remaining pages of data
  while (nextUrl) {
      try {
          const response = await fetch(nextUrl);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Categorize the data based on the name prefix
          const categorizedBatch = categorizeData(data.data);
          categorizedData = mergeCategorizedData(categorizedData, categorizedBatch);
          fetchedItems += data.data.length;
          updateProgressBar(fetchedItems, totalItems);

          nextUrl = data.meta.next ? `https://www.ebi.ac.uk/cgi-bin/ipd/api/allele${data.meta.next}` : null;
      } catch (error) {
          console.error('Error fetching data:', error);
          break;
      }
  }

  return categorizedData;
}

function categorizeData(data) {
  const categorized = {
      A: [],
      B: [],
      C: []
  };

  data.forEach(record => {
      const name = record.name || '';
      if (name.startsWith('A*')) {
          categorized.A.push({
              ligand: record['matching.kir_ligand'],
              name: record.name
          });
      } else if (name.startsWith('B*')) {
          categorized.B.push({
              ligand: record['matching.kir_ligand'],
              name: record.name
          });
      } else if (name.startsWith('C*')) {
          categorized.C.push({
              ligand: record['matching.kir_ligand'],
              name: record.name
          });
      }
  });

  return categorized;
}

function mergeCategorizedData(existingData, newData) {
  Object.keys(newData).forEach(key => {
      existingData[key] = existingData[key].concat(newData[key]);
  });
  return existingData;
}

function updateProgressBar(fetched, total) {
  const progressBar = document.getElementById('progress-bar');
  const progress = (fetched / total) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${Math.round(progress)}%`;
}

// Usage
const apiUrl = 'https://www.ebi.ac.uk/cgi-bin/ipd/api/allele?limit=5000&project=HLA&query=or(startsWith(name,A*),startsWith(name,B*),startsWith(name,C*))&fields=matching.kir_ligand';
fetchAllData(apiUrl)
  .then(categorizedData => {
    data = categorizedData;
      console.log('Categorized data:', categorizedData);
      // Further processing with categorizedData
  })
  .catch(error => console.error('Failed to fetch all data:', error));


/*
Možnosti:

https://hla.alleles.org/proteins/class1.html
https://raw.githubusercontent.com/ANHIG/IMGTHLA/Latest/wmda/hla_nom.txt
https://www.ebi.ac.uk/ipd/imgt/hla/about/help/api/
https://www.ebi.ac.uk/cgi-bin/ipd/matching/kir_ligand?pid=Patient&patb1=07:02&patb2=08:01&patc1=07:01&patc2=07:02&did=Donor&donb1=07:02&donb2=08&donc1=07:01&donc2=07:02
https://www.ebi.ac.uk/cgi-bin/ipd/api/allele?limit=1000&project=HLA&query=startsWith%28name%2C%2522B%2A08%2522%29&fields=matching.kir_ligand

https://www.ebi.ac.uk/ipd/rest/#/


*/


