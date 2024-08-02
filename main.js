const activatingTableBody = document.querySelector('#activating tbody');
const inhibitoryTableBody = document.querySelector('#inhibitory tbody');
const activatingMessage = document.getElementById('activating-message');
const inhibitoryMessage = document.getElementById('inhibitory-message');
const activatingTable = document.getElementById('activating');
const inhibitoryTable = document.getElementById('inhibitory');
const errorMessageElement = document.getElementById('error-message');
const ligandInfoElement = document.getElementById('ligand-info');
const progressBar = document.getElementById('progress-bar');

let patientHLAGenes = [];

let data = [];

let donorKIRgenes = {
  '2DS2': 0,
  '2DL2': 0,
  '2DL3': 0,
  '2DP1': 0,
  '2DL1': 0,
  '3DL1': 0,
  '2DS4': 0,
  '3DS1': 0,
  '2DS1': 0,
  '2DL5': 0,
  '2DS3': 0,
  '2DS5': 0,
  '3DL3': 1,
  '3DP1': 1,
  '2DL4': 1,
  '3DL2': 1,
};

function process() {

  const A11 = patientHLAGenes.filter(gene => {
    if (gene.name.startsWith('A*11') && !gene.name.endsWith('N') ) {
      gene.ligand = 'A11';
      return true;
    }
    return false;
  });
  const A11names = A11.map(gene => gene.name);
  const A11ligands = A11.map(gene => gene.ligand);
  
  const A0311 = patientHLAGenes.filter(gene => {
    if (gene.name.startsWith('A*11') && !gene.name.endsWith('N') ) {
      gene.ligand = 'A11';
      return true;
    } else if (gene.name.startsWith('A*03') && !gene.name.endsWith('N') ) {
      gene.ligand = 'A3';
      return true;
    }
    return false;
  });
  const A0311names = A0311.map(gene => gene.name);
  const A0311ligands = A0311.map(gene => gene.ligand);

  const Bw4 = patientHLAGenes.filter(gene => {
    if (gene.ligand && gene.ligand.startsWith('Bw4')) {
      return true;
    } else if (['A*23', 'A*24', 'A*32'].some(prefix => gene.name.startsWith(prefix)) && !gene.name.endsWith('N')) {
      gene.ligand = 'Bw4';
      return true;
    }
    return false;
  });

  const Bw4ligands =  Bw4.map(gene => gene.ligand);
  const Bw4names = Bw4.map(gene => gene.name);

  const C1 = patientHLAGenes.filter(gene => {
    if (gene.ligand && gene.ligand.startsWith('C1')) {
      return true;
    } else if (['B*46', 'B*73'].some(prefix => gene.name.startsWith(prefix)) && !gene.name.endsWith('N')) {
      gene.ligand = 'C1';
      return true;
    }
    return false;
  });
  const C1ligands = C1.map(gene => gene.ligand);
  const C1names = C1.map(gene => gene.name);

  const C2 = patientHLAGenes.filter(gene => gene.ligand && gene.ligand.startsWith('C2'));
  const C2ligands = C2.map(gene => gene.ligand);
  const C2names = C2.map(gene => gene.name);

  activatingTableBody.innerHTML = '';
  inhibitoryTableBody.innerHTML = '';

  const interactions = [
    { type: 'activating', kirGene: '3DS1', ligands: Bw4ligands, hlaGenes: Bw4names },
    { type: 'activating', kirGene: '2DS2', ligands: C1ligands, hlaGenes: C1names },
    { type: 'activating', kirGene: '2DS2', ligands: A11ligands, hlaGenes: A11names },
    { type: 'activating', kirGene: '2DS1', ligands: C2ligands, hlaGenes: C2names },
    { type: 'activating', kirGene: '2DS4', ligands: A11ligands, hlaGenes: A11names },
    { type: 'activating', kirGene: '2DS4', ligands: '-', hlaGenes: patientHLAGenes.filter(gene => ['C*01:02', 'C*02:02', 'C*04:01', 'C*05:01', 'C*14:02', 'C*16:01'].some(prefix => gene.name.startsWith(prefix)) && !gene.name.endsWith('N')).map(gene => [gene.name]) },
    { type: 'activating', kirGene: '2DS5', ligands: C2ligands, hlaGenes: C2names },
    
    { type: 'inhibitory', kirGene: '3DL2', ligands: A0311ligands, hlaGenes: A0311names },
    { type: 'inhibitory', kirGene: '3DL1', ligands: Bw4ligands, hlaGenes: Bw4names },
    { type: 'inhibitory', kirGene: '2DL2', ligands: C1ligands, hlaGenes: C1names },
    { type: 'inhibitory', kirGene: '2DL2', ligands: C2ligands, hlaGenes: C2names },
    { type: 'inhibitory', kirGene: '2DL2', ligands: '-', hlaGenes: patientHLAGenes.filter(gene =>['B*46:01','B*73:01'].some(prefix => gene.name.startsWith(prefix)) && !gene.name.endsWith('N')).map(gene => [gene.name]) },
    { type: 'inhibitory', kirGene: '2DL3', ligands: C1ligands, hlaGenes: C1names },
    { type: 'inhibitory', kirGene: '2DL3', ligands: C2ligands, hlaGenes: C2names },
    { type: 'inhibitory', kirGene: '2DL3', ligands: '-', hlaGenes: patientHLAGenes.filter(gene => gene.name.startsWith('B*46:01') || gene.name.startsWith('B*73:01')).map(gene => [gene.name]) },
    { type: 'inhibitory', kirGene: '2DL1', ligands: C2ligands, hlaGenes: C2names }
  ];

  // Helper function to add rows to the table
  const addRow = (tableBody, kirGene, ligands, hlaGenes) => {
    hlaGenes.forEach((hlaGene, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${kirGene}</td>
        <td>${ligands[index]}</td>
        <td>${hlaGene}</td>
      `;
      tableBody.appendChild(row);
    });
  };

  // Process interactions
  let hasActivatingInteractions = false;
  let hasInhibitoryInteractions = false;

  interactions.forEach(interaction => {
    if (donorKIRgenes[interaction.kirGene] == 1 && interaction.hlaGenes.length > 0) {
      if (interaction.type === 'activating') {
        addRow(activatingTableBody, `KIR${interaction.kirGene}`, interaction.ligands, interaction.hlaGenes);
        hasActivatingInteractions = true;
      } else if (interaction.type === 'inhibitory') {
        addRow(inhibitoryTableBody, `KIR${interaction.kirGene}`, interaction.ligands, interaction.hlaGenes);
        hasInhibitoryInteractions = true;
      }
    }
  });

  activatingTable.style.display = hasActivatingInteractions ? 'table' : 'none';
  activatingMessage.style.display = hasActivatingInteractions ? 'none' : 'block';

  inhibitoryTable.style.display = hasInhibitoryInteractions ? 'table' : 'none';
  inhibitoryMessage.style.display = hasInhibitoryInteractions ? 'none' : 'block';

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

  patientHLAGenes[0] = 
    {
      ligand: geneA1.ligand,
      name: geneA1.name
    };

  patientHLAGenes[3] = 
    {
      ligand: geneA2.ligand,
      name: geneA2.name
    };

  patientHLAGenes[1] = 
    {
      ligand: geneB1.ligand,
      name: geneB1.name
    };

  patientHLAGenes[4] = 
    {
      ligand: geneB2.ligand,
      name: geneB2.name
    }
  
  patientHLAGenes[2] = 
    {
      ligand: geneC1.ligand,
      name: geneC1.name
    };

  patientHLAGenes[5] = 
    {
      ligand: geneC2.ligand,
      name: geneC2.name
    };

  console.log(patientHLAGenes);

}

function updateHLAgene(elementId, HLA, number) {
  const inputElement = document.getElementById(elementId);
  const userInput = inputElement.textContent.trim();
  // Regular expression to check the format A*number, B*number, or C*number
  const formatRegex = /^(A|B|C)\*\d+(:\d+){0,3}[A-Z]?$|^(A|B|C)\*\d+(:\d+){0,3}:$/;

  // Check if the user input matches the expected format
  if (!formatRegex.test(userInput)) {
    errorMessageElement.textContent = 'Neplatný vstupní formát.';
    errorMessageElement.style.display = 'block';
    return;
  } else {
    errorMessageElement.style.display = 'none';
  }

  // Find all genes that start with the user's input
  const geneCategory = HLA;
  const matchingGenes = data[geneCategory].filter(gene => gene.name.startsWith(userInput));

  // If no matching genes are found, display an error message
  if (matchingGenes.length === 0) {
    errorMessageElement.textContent = 'Nenalezeny žádné takové geny, zkontolujte vstup.';
    errorMessageElement.style.display = 'block';
    return;
  } else {
    errorMessageElement.style.display = 'none';
  }

  // Calculate the percentages of associated KIR ligands, including null ligands
  const ligandCounts = { 'null': 0 }; // Initialize null ligand count
  matchingGenes.forEach(gene => {
    const ligand = gene.ligand || 'null'; // Treat undefined ligands as 'null'
    ligandCounts[ligand] = (ligandCounts[ligand] || 0) + 1;
  });

  const totalMatches = matchingGenes.length;
  const ligandPercentages = {};
  Object.keys(ligandCounts).forEach(ligand => {
    ligandPercentages[ligand] = (ligandCounts[ligand] / totalMatches) * 100;
  });
  
  // Randomly select a gene from the matching genes
  const randomGeneIndex = Math.floor(Math.random() * matchingGenes.length);
  const selectedGene = matchingGenes[randomGeneIndex];
  const selectedLigand = selectedGene.ligand || 'null';

  // Find the percentage of the selected ligand
  const selectedLigandPercentage = ligandPercentages[selectedLigand] || 0;

  // Update the patientHLAGenes array with the selected gene and ligand percentage
  const exactMatch = matchingGenes.find(gene => gene.name === userInput);
  patientHLAGenes[number] = exactMatch || {
    ligand: `${selectedLigand} (${selectedLigandPercentage.toFixed(2)}%)`,
    name: userInput
  };

  console.log('Updated HLA genes:', patientHLAGenes);
  console.log('Selected gene and ligand:', selectedGene.name, selectedLigand);
  console.log('Ligand percentages:', ligandPercentages);
  
  // Optionally, display the ligand percentages to the user
  //displayLigandPercentages(ligandPercentages);
}

function displayLigandPercentages(ligandPercentages) {
  ligandInfoElement.innerHTML = '';
  
  Object.keys(ligandPercentages).forEach(ligand => {
    const percentage = ligandPercentages[ligand];
    ligandInfoElement.innerHTML += `<p>${ligand === 'null' ? 'null' : ligand}: ${percentage.toFixed(2)}%</p>`;
  });
}


function displayLigandPercentages(ligandPercentages) {
  ligandInfoElement.innerHTML = '';
  
  Object.keys(ligandPercentages).forEach(ligand => {
    const percentage = ligandPercentages[ligand];
    ligandInfoElement.innerHTML += `<p>${ligand}: ${percentage.toFixed(2)}%</p>`;
  });
}


function updateKIRgene(checkbox) {
  const gene = checkbox.id;
  donorKIRgenes[gene] = checkbox.checked ? 1 : 0;
  //console.log(donorKIRgenes);
}

function updateKIR() {
  const kirGenes = [
      '2DS2', '2DL2', '2DL3', '2DP1', '2DL1', '3DL1', 
      '2DS4', '3DS1', '2DL5', '2DS3', '2DS5', '2DS1'
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

  //console.log(donorKIRgenes);
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
  const progress = (fetched / total) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${Math.round(progress)}%`;
}

// Usage
const apiUrl = 'https://www.ebi.ac.uk/cgi-bin/ipd/api/allele?limit=5000&project=HLA&query=and(or(eq(locus,C*),eq(locus,B*),eq(locus,A*)),eq(status,public))&fields=matching.kir_ligand';

fetchAllData(apiUrl)
  .then(categorizedData => {
    data = categorizedData;
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


