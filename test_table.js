  (function() {
        var viz = {
          id: "testtable",
          label: "TEST - Table",
          options: {
            previous_month: {
              section: "Chart",
              type: "boolean",
              label: "Turn on Previous Month",
              display: "radio",
              default: false
            }
          },

          // Set up the initial state of the visualization
          create: function(element, config) {
              var css = element.innerHTML = `
              <div id="testtable"></div>
              `;
          },
          // Render in response to the data or settings changing
          update: function(data, element, config, queryResponse) {

            if ($("#testtable").hasClass("tabulator")){ $("#testtable").tabulator("destroy") }

            var clmns = [ { title: "Measure", field: "measure", sortable: true, datanum:-1 } ];
            for (var i=0; i<data.length; i++) {
              var temp =  { title: data[i][queryResponse.fields.dimension_like[0].name].value,
                            field: data[i][queryResponse.fields.dimension_like[0].name].value,
                            datanum: i,
                            sortable:true
                          };
              clmns.push(temp)
            }

            var rws = []
            for (var i=0; i<queryResponse.fields.measure_like.length; i++) {  
              var rw = {measure: queryResponse.fields.measure_like[i].label_short};
              for (j=1; j<clmns.length; j++) {
                rw[clmns[j].field] = data[clmns[j].datanum][queryResponse.fields.measure_like[i].name].value
              }
              rws.push(rw);
            }


            if (config.previous_month) {
              clmns.push({ title: "Over Previous Month", field: "previous_month", sortable: true, datanum:-2, 
                            formatter:function(cell, formatterParams){
                              let val = (Math.round(cell.getValue()*100));
                              val = (val<0) ? '<font color="red">▼ '+Math.abs(val).toFixed(2)+'%</font>' : '<font color="green">▲ '+ val.toFixed(2)+'%</font>'
                              return val
                            }
              });

              $.each( rws, function(i, val) {
                  rws[i]['previous_month'] = (1.0 * val[data[0][queryResponse.fields.dimension_like[0].name].value] / val[data[1][queryResponse.fields.dimension_like[0].name].value] - 1 );
              });
            }



            var tbl = $("#testtable").tabulator({
              layout: "fitColumns",
              columns: clmns,
              data: rws
            });

          }
      };
      looker.plugins.visualizations.add(viz);
      }());
