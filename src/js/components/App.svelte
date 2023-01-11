
      <script>
          import Fonts from './Fonts.svelte';

          import GraphicDescription from './GraphicDescription.svelte';
          import GraphicNotes from './GraphicNotes.svelte';
          import GraphicTitle from './GraphicTitle.svelte';
          
        import Graphic0 from '../../ai2svelte-output/three_counties_ai2html2.svelte';
    

        import Graphic1 from '../../ai2svelte-output/poultry_statewide_viz_ai2html4.svelte';
    

          const domain = window.pageInfo['marketInfo.domain'];
          
        const baseUrl0 = `https://www.${domain}.com/static/hi/2023/ai2svelte-examples/three_counties_ai2html2`
        const imagePath0 = import.meta.env.PROD ? `${baseUrl0}` : '../../src/ai2svelte-output/imgs'
    

        const baseUrl1 = `https://www.${domain}.com/static/hi/2023/ai2svelte-examples/poultry_statewide_viz_ai2html4`
        const imagePath1 = import.meta.env.PROD ? `${baseUrl1}` : '../../src/ai2svelte-output/imgs'
    

      </script>

      <style type='text/css'>
          :global(.g-text) {
          width: min(var(--story-width), 100%);
          --hf: var(--serif);
          --ht: none;
          }
      </style>

      <Fonts/>
      
        <GraphicTitle text="Big poultry growth spurts"/>
        <GraphicDescription text="Three counties with significant growth in the number of poultry raised include Robeson, Anson and Duplin."/>
        <Graphic0 imagePath={imagePath0}/>
        <GraphicNotes text="Source: N.C. Department of Agriculture and Consumer Services"/>
    <p>Integer eu tristique odio. Sed ac dui non quam aliquam pretium. Suspendisse potenti. Vivamus vehicula sapien ac dignissim sodales. Curabitur lobortis euismod maximus. Nunc condimentum consectetur tellus non consectetur. Cras suscipit metus eget mi convallis dignissim eu a sem. Mauris mi risus, porta at malesuada quis, viverra sit amet erat. Vestibulum vitae commodo libero. Nam volutpat vitae odio porta vehicula.</p>
        <GraphicTitle text="North Carolina’s poultry crop: more than 1 billion birds"/>
        <GraphicDescription text="Statewide, chicken and turkey production has grown 66% since 1991. It jumped more than 17% since 2016."/>
        <Graphic1 imagePath={imagePath1}/>
        <GraphicNotes text="Source: N.C. Department of Agriculture and Consumer Services"/>
    
  