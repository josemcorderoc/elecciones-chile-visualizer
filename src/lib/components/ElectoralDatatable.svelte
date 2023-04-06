<script lang="ts">
    import jQuery from 'jquery';
    import DataTable from 'datatables.net-dt';
    import 'datatables.net';
    import 'datatables.net-dt/css/jquery.dataTables.css';
    import languageES from 'datatables.net-plugins/i18n/es-MX.mjs';
    // import languageDE from 'datatables.net-plugins/i18n/de-DE.mjs';
    // import { onMount } from 'svelte'; 

    import JSZip from 'jszip'; // For Excel export
    
    import 'datatables.net-buttons/js/buttons.html5.mjs';
    import 'datatables.net-buttons/js/buttons.print.mjs';
    import 'datatables.net-responsive-dt';
    import type { ElectionOutcome } from '../types';
    import { candidateTypeResults } from '../state';
    import DataTables from 'datatables.net-dt';
    DataTable.Buttons.jszip(JSZip);
   
    export let data: ElectionOutcome[] = [];
    let table: DataTables.Api;
  
    const columns: DataTables.ColumnSettings[] = [
      { data: 'ElectionName', title: 'Elección' },
      { data: 'EntityName', title: "Candidato" },
      { data: 'ComunaName', title: 'Comuna' },
      { 
        data: 'Votes',
        title: 'Votos',
        render: DataTable.render.number(".", ",", 0)
      },
      { data: 'PercVotes', 
        title: 'Votos (% comuna)',
        render: DataTable.render.number(".", ",", 2, null, "%")
      }
    ];

    // $: table.columns["EntityName"].ColumnName = $candidateTypeResults;
    // $: table  
    // function resizeTable() {
    //   console.log("reisze")
    //   // jQuery("table").resize()
    //   table.columns.adjust().draw();
    // }


    // function resizeTable() {
    //   const parentDiv = jQuery('#parentDiv');
    //   const tableWrapper = jQuery('table');
    //   const parentWidth = parentDiv.width();
    //   tableWrapper.css('width', parentWidth);
    //   table.columns.adjust().draw();
    // }
    // window.onresize = resizeTable;
  
    function createTable(node: HTMLElement, data) {
      if (table) {
        table.destroy();
      }
      table = jQuery('table').DataTable({
        data,
        columns,
        order: [3, "desc"],
        paging: true,
        searching: false,
        responsive: true,
        // lengthMenu: [ 10, 25, 50, 75, 100 ],
        info: true,
        // buttons: [
        //   'csv', 'excel',  {
        //         text: 'My button',
        //         action: function ( e, dt, node, config ) {
        //             alert( 'Button activated' );
        //         }
        //     }
        // ],
        // scrollX:true,
        dom: 'Bfrtlip',
        language: languageES,
        autoWidth: false
      });
      return {
            update(data) {
              createTable(node, data)
            },
            destroy() {
            },
        };
    }

    // onMount(()=> {
    //     createTable();
    // });
  </script>
  <!-- <svelte:window on:resize={resizeTable} /> -->
  <div>
    <table use:createTable={data}></table>
  </div>
  <style>
    table {
      width: 100%;
    }

    
    :global(.dt-buttons) {
      font-size:12px
    }
    /* div.container {
      width: 80%;
    } */
    /* :global(.dataTables_wrapper .dt-buttons) {
  float:none;  
  text-align:center;
} */

  </style>
  
  
  