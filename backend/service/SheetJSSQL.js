/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* global XLSX, require, module */

    
var SheetJSSQL = (function () {

    var X;
    if (typeof XLSX !== "undefined") X = XLSX;
    else if (typeof require !== 'undefined') X = require('xlsx');
    else throw new Error("Could not find XLSX");

    var _TYPES = {
        "PGSQL": { t: "text", n: "float8", d: "timestamp", b: "boolean" },
        "MYSQL": { t: "TEXT", n: "REAL", d: "DATETIME", b: "TINYINT" },
        "SQLITE": { t: "TEXT", n: "REAL", d: "TEXT", b: "REAL" }
    }
    function sheet_to_sql(ws, sname, mode) {
        var BT = mode == "PGSQL" ? "" : "`";
        var Q = mode == "PGSQL" ? "'" : '"';
        var J = mode == "PGSQL" ? /'/g : /"/g;
        var TYPES = _TYPES[mode || "SQLITE"]
        if (!ws || !ws['!ref']) return;

        var range = X.utils.decode_range(ws['!ref']);

        if (!range || !range.s || !range.e || range.s > range.e) return;
        // console.log('\n'+range.e.r.toString()) 
        var R = range.s.r, C = range.s.c;
        var name1 = new Array(0);
        var name2 = new Array(0);
        var temp = ""
        var names = new Array(range.e.c - range.s.c + 1);
        for (C = range.s.c; C <= range.e.c; ++C) {
            var addr = X.utils.encode_cell({ c: C, r: R });
            names[C - range.s.c] = ws[addr] ? ws[addr].v : X.utils.encode_col(C);
            temp = BT + names[C - range.s.c].replace(' ', '').replace(' ', '') + BT
            if (temp.includes('Section') || temp.includes('Term') || temp.includes('TeachType') || temp.includes('CourseTitle') || temp.includes('CatalogNumber') || temp.includes('Instructor') || temp.includes('Remarks')) {
                name2.push(temp);
            } else if (temp.includes('MeetingDay') || temp.includes('Room')) {
                name1.push(temp)
            } else if (temp.includes('MeetingTime')) {
                name1.push(BT + 'StartTime' + BT);
                name1.push(BT + 'EndTime' + BT);
            }

        } name1.push(BT + 'Subject_id' + BT);
        //console.log("name1>>" + name1.toString() + "\nname2>>" + name2.toString())

        // var type1 = new Array(0);
        // var type2 = new Array(0);
        // for (C = range.s.c; C <= range.e.c; ++C) {
        //     var addr = X.utils.encode_cell({ c: C, r: R });
        //     names[C - range.s.c] = ws[addr] ? ws[addr].v : X.utils.encode_col(C);
        //     temp = BT + names[C - range.s.c].replace(' ', '').replace(' ', '') + BT
        //     if (temp.includes('Section') || temp.includes('Term') || temp.includes('TeachType') || temp.includes('CourseTitle') || temp.includes('CatalogNumber') || temp.includes('Instructor') || temp.includes('Remarks')) { type2.push('TEXT'); }
        //     else if (temp.includes('MeetingDay') || temp.includes('Room')) {
        //         type1.push('TEXT')
        //     } else if (temp.includes('Capacity')) {
        //         type1.push('INTEGER');
        //     } else if (temp.includes('MeetingDay')) {
        //         type1.push('StartTime');
        //     }
        // }
        // //  types[C-range.s.c] = _type || TYPES.t;
        // console.log('>>1' + type1 + '\n2>> ' + type2)
        var out = [];
        var out2 = [];

        for (R = range.s.r + 1; R <= range.e.r; ++R) {

            if (!ws[X.utils.encode_cell({ c: 7, r: R })]) continue;
            if (ws[X.utils.encode_cell({ c: 7, r: R })].v.toString().includes('MATH-')) {
                var val1 = [];
                var val2 = [];
                for (C = range.s.c; C <= range.e.c; ++C) {
                    var cell = ws[X.utils.encode_cell({ c: C, r: R })];
                    temp = BT + names[C - range.s.c].replace(' ', '').replace(' ', '') + BT
                    if (cell) {
                        temp = BT + names[C - range.s.c].replace(' ', '').replace(' ', '') + BT
                        var val = cell.v;
                        if (temp.includes('Section') || temp.includes('Term') || temp.includes('TeachType') || temp.includes('CourseTitle') || temp.includes('CatalogNumber') || temp.includes('Instructor') || temp.includes('Remarks')) {
                            val2.push(Q + val + Q);
                        } else if (temp.includes('MeetingTime')) {
                            try {
                                // var t = val.toString()
                                //.spilt("-");
                                val1.push(Q + val.split("-")[0] + Q);
                                val1.push(Q + val.split("-")[1] + Q);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        } else if (temp.includes('Room') || temp.includes('MeetingDay')) {
                            val1.push(Q + val + Q)
                        }
                    } else {
                        if (temp.includes('Section') || temp.includes('Term') || temp.includes('TeachType') || temp.includes('CourseTitle') || temp.includes('CatalogNumber') || temp.includes('Instructor') || temp.includes('Remarks')) {
                            val2.push(Q + Q);
                        } else if (temp.includes('MeetingTime')) {
                            val1.push(Q + Q); val1.push(Q + Q);
                        } else if (temp.includes('Room') || temp.includes('MeetingDay')) {
                            val1.push(Q + Q)
                        }
                    }
                }
                val1.push("(SELECT" + BT + "SubjectID" + BT + "FROM " + BT + "subject" + BT + " WHERE (" + BT + "CatalogNumber" + BT + "=" + val2[1] + " AND " + BT + "Section" + BT + " =" + val2[3] + " AND " + BT + "Instructor" + BT + " =" + val2[5]+"))");
                // console.log("\nval1>>" + val1 + "\nval2>>" + val2)
                var sql = "INSERT IGNORE  INTO " + BT + 'subject' + BT + " (" + name2.join(", ") + ") VALUES (" + val2.join(",") + ");";

                var sql2 = "INSERT IGNORE  INTO " + BT + 'timeTables' + BT + " (" + name1.join(", ") + ") VALUES (" + val1.join(",") + ");";
                //ON DUPLICATE KEY UPDATE "+BT+'Term'+BT +'='+ val2[0]+',' +BT+'CourseTitle'+BT +'='+ val2[2]+',' +BT+'Instructor'+BT +'='+ val2[3]+";";
                if(!out.includes(sql)){
                    out.push(sql)}
                //out.push(sql2)

                out2.push(sql2)
            }
        }
        out = out.concat(out2)
        return out

    }

            
    function book_to_sql(wb, mode) {
        return wb.SheetNames.reduce(function (acc, n) {
            return acc.concat(sheet_to_sql(wb.Sheets[n], n, mode));
        }, []);
    }

    return {
        book_to_sql: book_to_sql,
        sheet_to_sql: sheet_to_sql
    };
})();
if (typeof module !== 'undefined') module.exports = SheetJSSQL;
