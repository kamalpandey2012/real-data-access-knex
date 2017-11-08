module.exports = {
  parseSortString: parseSortString,
  idToMMObjArr: idToMMObjArr,
  getMMDelta: getMMDelta
};

function parseSortString(sortString, defaultSort) {
  let s = sortString || defaultSort || "";
  const result = {
    column: "",
    direction: "asc"
  };
  s = s.split(" ");
  if (s.length < 1) {
    return null;
  }
  result.column = s[0];
  if (!result.column) {
    return null;
  }
  if (s.length === 1) {
    return result;
  }
  if (s[1].toLowerCase() == "desc") {
    result.direction = "desc";
  }

  return result;
}

function idToMMObjArr(arrFieldName, idArray, otherFieldName, otherId) {
  return idArray.map(function(o) {
    let x = {};
    x[arrFieldName] = o;
    x[otherFieldName] = otherId;
    return x;
  });
}

function getMMDelta(
  newIds,
  currentIds,
  variableFieldName,
  constFieldName,
  constId
) {
  let add = [],
    del = [];

  for (let i = 0; i < newIds.length; i++) {
    if (currentIds.indexOf(newIds[i]) == -1) {
      let x = {};
      x[variableFieldName] = newIds[i];
      x[constFieldName] = constId;
      add.push[x];
    }
  }

  for (let i = 0; i < currentIds.length; i++) {
    if (newIds.indexOf(currentIds[i]) == -1) {
      let x = {};
      x[variableFieldName] = currentIds[i];
      x[constFieldName] = constId;
      del.push(x);
    }
  }
  return { add: add, del: del };
}
