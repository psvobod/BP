let sectionA = [];
let sectionB = [];
let sectionC = [];

let patientHLAGenes = {
  A: { '1': '', '2': ''},
  B: { '1': '', '2': ''},
  C: { '1': '', '2': ''}
};

let donorKIRgenes = {
  '2DS2': 0,
  '2DL2': 0,
  '2DL3': 0,
  '2DP1': 0,
  '2DL1': 0,
  '3DL1': 0,
  '2DS4': 0,
  '3DS1': 0,
  '2DL5': 0,
  '2DS3': 0,
  '2DS5': 0,
  '3DL3': 1,
  '3DP1': 1,
  '2DL4': 1,
  '3DL2': 1,
};

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return "HLA-" + arr[randomIndex];
}

function updateHLA() {
    if (sectionA.length === 0 || sectionB.length === 0 || sectionC.length === 0) {
        console.error('Data not loaded yet.');
        return;
    }

    const geneA1 = getRandomItem(sectionA);
    const geneB1 = getRandomItem(sectionB);
    const geneC1 = getRandomItem(sectionC);
    const geneA2 = getRandomItem(sectionA);
    const geneB2 = getRandomItem(sectionB);
    const geneC2 = getRandomItem(sectionC);

    document.getElementById("hla-a-row1").textContent = geneA1;
    document.getElementById("hla-b-row1").textContent = geneB1;
    document.getElementById("hla-c-row1").textContent = geneC1;
    document.getElementById("hla-a-row2").textContent = geneA2;
    document.getElementById("hla-b-row2").textContent = geneB2;
    document.getElementById("hla-c-row2").textContent = geneC2;

    patientHLAGenes = {
      A: { '1': geneA1, '2': geneA2 },
      B: { '1': geneB1, '2': geneB2 },
      C: { '1': geneC1, '2': geneC2 }
    };
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

async function getData(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.text();
      return filterAndExtractData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  
function filterAndExtractData(text) {
  const lines = text.split('\n');

  const currentAllelesRegex = /^(A\*|B\*|C\*).*;;;$/;
  const filteredLines = lines.filter(line => currentAllelesRegex.test(line.trim()));

  const alleleLines = filteredLines.map(line => line.slice(0, line.indexOf(';', line.indexOf(';') + 1)));

  const functionalAllelesRegex = /N/;
  const functionalAlleles = alleleLines.filter(line => !functionalAllelesRegex.test(line.trim()));

  const proteins = functionalAlleles.map(line => {
      const firstColonIndex = line.indexOf(':');
      const secondColonIndex = line.indexOf(':', firstColonIndex + 1);
      return secondColonIndex !== -1 ? line.slice(0, secondColonIndex) : line;
      });

  const uniqueProteins = new Set(proteins);
  const cleanedProteins = Array.from(uniqueProteins).map(line => line.replace(/[;QL]/g, ''));

  const result = cleanedProteins.join("\n");

  return result;
}


function parseTextData(text) {
  const lines = text.trim().split('\n');
  const sectionA = [];
  const sectionB = [];
  const sectionC = [];

  lines.forEach(line => {
    if (line.startsWith('A')) {
      sectionA.push(line);
    } else if (line.startsWith('B')) {
      sectionB.push(line);
    } else if (line.startsWith('C')) {
      sectionC.push(line);
    }
  });

  return { sectionA, sectionB, sectionC };
}
  

(async () => {
  const url = 'https://raw.githubusercontent.com/ANHIG/IMGTHLA/Latest/wmda/hla_nom.txt';
  const filteredData = await getData(url);
  if (filteredData) {
    //console.log('Filtered and extracted data: \n', filteredData);
    const result = parseTextData(filteredData);
    sectionA = result.sectionA;
    sectionB = result.sectionB;
    sectionC = result.sectionC;
  } else {
    console.log('Failed to retrieve data.');
  }
})();


/*
Možnosti:

https://hla.alleles.org/proteins/class1.html
https://raw.githubusercontent.com/ANHIG/IMGTHLA/Latest/wmda/hla_nom.txt
https://www.ebi.ac.uk/ipd/imgt/hla/about/help/api/
https://www.ebi.ac.uk/cgi-bin/ipd/matching/kir_ligand?pid=Patient&patb1=07:02&patb2=08:01&patc1=07:01&patc2=07:02&did=Donor&donb1=07:02&donb2=08&donc1=07:01&donc2=07:02
https://www.ebi.ac.uk/cgi-bin/ipd/api/allele?limit=1000&project=HLA&query=startsWith%28name%2C%2522B%2A08%2522%29&fields=matching.kir_ligand

https://www.ebi.ac.uk/ipd/rest/#/


*/


