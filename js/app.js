$( document ).ready(function() {
  var db = openDatabase("hospital", "0.1", "hospital", 200000);
  var tableBody = $("#person-nodes");

  if (!db) {
    console.log("Failed to connect to database.");
  } else {
    console.log("Establish connect to database.");
  }

  $("button#reset-table").click(function () {
    resetTable(db);
  });

  fillNodeIds();

  function fillNodeIds() {
    var select = $("select#node-ids");
    select.empty();
    select.append('<option value="" disabled selected>Select person id</option>');
    db.transaction(function (tx) {
      tx.executeSql("SELECT id FROM Persons", [], function (tx, result) {
        var data;
        for (var i = 0; i < result.rows.length; i++) {
          data = '<option value="' +
          result.rows.item(i)['id'] +
          '">' +
          result.rows.item(i)['id'] + '</option>';
          console.log(data);
          select.append(data);
        }
      }, null)
    });
  }

  $("#delete-node").click(function () {
    var deletedId = parseInt($("select#node-ids option:selected").val());
    console.log("Deleted id: " + deletedId);
    db.transaction(function (tx) {
      tx.executeSql("DELETE FROM Persons WHERE id = (?)", [deletedId],
          function (tx, result) {
            console.log("Data delete successfully");
            fillNodeIds();
          },
          function () {
            console.log("Data delete fail");
          }
      );
    });
  });


  $("form#person-form").submit(function (e) {
    e.preventDefault();
    var data = $(this).serializeArray();

    db.transaction(function (tx) {
      tx.executeSql("INSERT INTO Persons(name, address, phone, isNeedHelp) values(?, ?, ?, ?)", [data[0].value, data[1].value, data[2].value, data[3] != undefined],
          function (tx, result) {
            console.log("Data insert successfully");
            var data;
            for (var i = 0; i < result.rows.length; i++) {
              data = '<tr><th scope="row">' +
              result.rows.item(i)['id'] +
              '</th><td>' +
              result.rows.item(i)['name'] +
              '</td><td>' +
              result.rows.item(i)['address'] +
              '</td><td>' +
              result.rows.item(i)['phone'] +
              '</td><td>' +
              result.rows.item(i)['isNeedHelp'] +
              '</td></tr>';
              console.log(data);
            }
            fillNodeIds();
          },
          function () {
            console.log("Data insert fail");
          }
      );
    });
  });

  $("#show-nodes").click(function() {
    tableBody.empty();

    db.transaction(function (tx) {
      tx.executeSql("SELECT * FROM Persons", [], function (tx, result) {
        var data;
        for (var i = 0; i < result.rows.length; i++) {
          data = '<tr><th scope="row">' +
          result.rows.item(i)['id'] +
          '</th><td>' +
          result.rows.item(i)['name'] +
          '</td><td>' +
          result.rows.item(i)['address'] +
          '</td><td>' +
          result.rows.item(i)['phone'] +
          '</td><td>' +
          result.rows.item(i)['isNeedHelp'] +
          '</td></tr>';

          console.log(data);
          tableBody.append(data);
        }
        console.log("Data append");
      }, null)
    });

  });


  $("#show-nodes-help").click(function() {
    tableBody.empty();

    db.transaction(function (tx) {
      tx.executeSql("SELECT * FROM Persons WHERE isNeedHelp = 'true' ", [], function (tx, result) {
        var data;
        for (var i = 0; i < result.rows.length; i++) {
          data = '<tr><th scope="row">' +
          result.rows.item(i)['id'] +
          '</th><td>' +
          result.rows.item(i)['name'] +
          '</td><td>' +
          result.rows.item(i)['address'] +
          '</td><td>' +
          result.rows.item(i)['phone'] +
          '</td><td>' +
          result.rows.item(i)['isNeedHelp'] +
          '</td></tr>';

          console.log(data);
          tableBody.append(data);
        }
        console.log("Data append");
      }, null)
    });
  });
});

function resetTable(db) {
  db.transaction(function(tx) {
    tx.executeSql("DROP TABLE Persons", [],
        function() {
          console.log("Table dropped successfully");
        },
        function() {
          console.log("Table dropped failed");
        }
    );
    tx.executeSql("CREATE TABLE Persons( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), address VARCHAR(255), phone VARCHAR(255), isNeedHelp BOOLEAN)", [],
        function() {
          console.log("Table created successfully");
        },
        function() {
          console.log("Table created failed");
        }
    );
  });
}