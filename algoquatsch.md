## Aufgabe 1 (Heap-Eigenschaft)

a) Valider (Max-)Heap, weil jeder Parent Node größer oder gleich seinen Child Nodes ist.
Array: `A = [17, 15, 17, 13, 6, 12, 10, 1, 5, 3, 1, 11]`

Baum:
```latex
           17
         /    \
       15       17
      /  \     /  \
    13    6   12   10
   / \   / \  /
  1   5 3  1 11
```

Der Baum erfüllt die Heap-Eigenschaft, da für jeden Knoten gilt, dass sein Wert größer oder gleich dem Wert seiner Kinder ist.

b) Almost Heap (Near-Heap) weil nur die root node die Heap-Eigenschaft verletzt.
Array: `A = [4, 14, 13, 3, 8, 12, 11, 2, 2, 5, 7, 2]`

Baum:
```latex
           4
         /   \
       14     13
      /  \   /  \
    3    8  12  11
   / \  / \ /
  2  2 5  7 2
```

Der Baum erfüllt die Heap-Eigenschaft nicht, da der Wert der Wurzel (4) kleiner ist als der Wert seines linken Kindes (14).

**Schritt 1**: Vertausche 4 mit 14
Array: `A = [14, 4, 13, 3, 8, 12, 11, 2, 2, 5, 7, 2]`

Baum:
```latex
           14
         /   \
       4      13
      /  \   /  \
    3    8  12  11
   / \  / \ /
  2  2 5  7 2
```

**Schritt 2**: Vertausche 4 mit 8
Array: `A = [14, 8, 13, 3, 4, 12, 11, 2, 2, 5, 7, 2]`

Baum:
```latex
           14
         /   \
       8      13
     /  \    /  \
    3    4  12  11
   / \  / \ /
  2  2 5  7 2
```

**Schritt 3**: Es fehlt noch ein Schritt, um die Heap-Eigenschaft zu erfüllen.
7 mit 4 vertauschen:
Array: `A = [14, 8, 13, 3, 7, 12, 11, 2, 2, 5, 4, 2]`

Baum:
```latex
           14
         /   \
       8       13
     /  \     /  \
    3    7   12  11
   / \  / \  /
   2  2 5  4 2
```



c) Not a Heap, da die Heap-Eigenschaft mehrfach verletzt wird.
Array: `A = [20, 10, 12, 9, 8, 3, 10, 13, 10, 15, 3, 7]`

Baum:
```latex
           20
         /     \
       10       12
      /  \      /  \
     9    8     3   10
    / \   / \  /
   13 10 15 3 7
```

Hier können wir faul sein, höhö! :D



## Aufgabe 2 (Almost Optimal Priority Queue)

Wir verwenden die Accounting-Methode mit einer Potentialfunktion, um dieentsprechenden Laufzeiten zu zeigen.
Potentialfunktion: Φ(H) = n * log n, wobei n die Anzahl der Elemente im Heap ist.
Die Funktion ist legal, da Φ(H) >= 0 für alle Heaps gilt und Φ(leerer Heap) = 0.

**Insert**: Hierbei wird ein neues Element eingefügt und wir lassen es nach oben wandern.
Kosten für Bubble-Up: O(log n).
Potentialänderung:
Vorher haben wir Φ = n * log n und nachher Φ' = (n+1) * log(n+1).
Die Differenz ist dann Φ' - Φ = (n+1) * log(n+1) - n * log n (was sich zu log n vereinfacht) => Φ' - Φ = O(log n).
Amortisierte Kosten: O(log n) + O(log n) = O(log n)
Die Insert-Operation baut zusätzliches "Potential" auf, das wir später in deletemax() nutzen können.

**DeleteMax**: Bei DeleteMax entfernen wir die Wurzel und lassen das letzte Element nach unten wandern (Heapify-Down).
Tatsächliche Kosten: O(log n) für das Heapify-Down
Potentialänderung:
Vorher haben wir Φ = n * log n und nachher: Φ' = (n-1) * log(n-1). Damit ist die Differenz: Φ' - Φ = (n-1) * log(n-1) - n * log n was ~log n weniger ist. Dadurch gilt: Φ' - Φ = -O(log n) und die amortisierten Kosten sind dann: O(log n) + (-O(log n)) = O(1).

Das bei Insert gesammelte Potential wird "verbraucht", sodass die amortisierten Kosten konstant sind.
(Ähnlich, wie wenn wir extra Credits bei Insert sammeln, die wir bei DeleteMax ausgeben.)

**Max**: Die Max-Operation gibt einfach die Wurzel zurück, ohne den Heap zu verändern.
Tatsächliche Kosten: O(1)mit 1 Credit, amortisierte Kosten: O(1) + 0 = O(1).

**Fazit**:
Durch die Wahl der Potentialfunktion: Φ(H) = n * log n können wir zeigen, dass Insert bei jedem Aufruf genug Potential aufbaut (Credits bekommt), um die Kosten von DeleteMax zu decken. Wir bekommen dadurch jeweils die amortisierten Laufzeiten von O(log n), O(1) und O(1) mit der Anmerkung, dass die Priority Queue fast optimal arbeitet (Ist das die Aussage hier?).



## Aufgabe 3: k-largest Element in einem Array

**Idee**: Wir bauen aus array A einen Max-Heap und extrahieren dann k-mal das Maximum, indem wir wiederholt das Wurzelelement löschen und den Heap neu aufbauen, bis wir das k-te Maximum erreichen und zurückgeben können.

**Algorithmus**:
```c
function kth_largest(A, k) {
    H = makeheap(A)             # O(n) aus VL
    for i = 1 to k-1:           # (k-1) mal löschen
        H.deletemax()           # O(log n) aus VL => O(k log n)
    return H.max()              # O(1)
}
```

**Correctness**:
Wir stellen durch den Aufbau eines Max-Heaps mit makeheap(A) sicher, dass das größte Element initial an der Wurzel liegt. Die Funktion deletemax() aus der VL "löscht" die Wurzel und restrukturiert den Heap, sodass erneut ein Maximal-Element als neue Wurzel existiert. Durch (k-1)-maliges Entfernen des Maximums erhalten wir dann das k-te größte Element nach der letzten Restrukturierung durch deletemax(), indem wir zum Schluss die Wurzel des Heaps zurückgeben.

**Running Time**:
- Der Aufbau des Heaps geht in O(n) Zeit mit makeheap().
- Jede DeleteMax-Operation geht in O(log n) Zeit, und wir führen diese Operation k-mal durch, was insgesamt O(k log n) Zeit ergibt.
- Somit beträgt die Gesamtzeit O(n + k log n), wie gefordert.


## Aufgabe 4: Analyse von Heapsort

**Idee**: Direkt eine Idee ist es, einen Max und Min-Heap zu verwenden, um die unteren und oberen Hälften der Elemente zu tracken. Der Max-Heap speichert die kleineren Elemente (bis zum Median), der Min-Heap die größeren Elemente.

**Algortithmus**:

```c
function Medians(A) {
    n = len(A)
    R = new array of size n
    maxH = makeheap()        # untere Hälfte in O(n)
    minH = makeminHeap()     # obere Hälfte in O(n)
    for l = 1 to n:
        e = A[l]
        
        if max.empty() or e <= maxH.max():
            maxH.insert(e)
        else:
            minH.insert(e)
        
        if maxH.size() > minH.size() + 1:
            minH.insert(maxH.deletemax())
        elif minH.size() > maxH.size():
            maxH.insert(minH.deletemin())   # Balancing
        
        R[l] = maxH.max()
    return R
}
```

**Correctness**:
Der Algorithmus funktioniert, da wir durch die Verwendung von zwei Heaps sicher gehen, dass Max-Heap immer die kleineren Elemente und  Min-Heap die größeren Elemente enthält. Durch das Balancing der Heaps nach jedem Einfügen ist garantiert, dass die Größen der Heaps fast ~gleich sind. Der Median wird dann korrekt aus dem Max-Heap (bei ungerader Anzahl) oder als Durchschnitt der Wurzelelemente beider Heaps (bei gerader Anzahl) berechnet. Die Invariante garantiert, dass maxH.size() = ⌈l/2⌉, bei ungeradem l: maxH hat (l+1)/2 Elemente,
bei geradem l hat maxH l/2 Elemente, wodurch in beiden Fällen der Median korrekt als maxH.max() zurückgegeben wird mit dem Element an Position ⌈l/2⌉.

**Running Time**:
Das Einfügen in einen Heap dauert O(log l) Zeit, mit l als die aktuelle Anzahl der Elemente.
Bei n Elementen beträgt die Gesamtzeit O(n log n).
Das Balancing der Heaps und das Abrufen des Medians sind ebenfalls O(log l), die in die Gesamtzeit von O(n log n) mit inbegriffen sind. D.h. der Algorithmus läuft in O(n log n), wie gewünscht.



## Aufgabe 5:

**Idee**: Wir sortieren die Züge mit MergeSort (stabil!) nach Ankunftszeit und verwenden einen Min-Heap, um die Abfahrtszeiten aller aktuell belegten Plattformen zu speichern. Die maximale Heap-Größe ist dann die minimalen Anzahl benötigter Plattformen. (Es ist effektiv ein Greedy-Algorithmus.)

**Algorithmus**:
```c
function MinPlatforms(L[1..n]) {
    MergeSort(L)                        # by arrival time in O(n log n)
    platforms =  MinHeap()
    max_platforms = 0
    
    for i = 1 to n:
        if not platforms.empty() and platforms.min() <= L[i].arrival:
            platforms.deleteMin()
        
        platforms.insert(L[i].departure)
        max_platforms = max(max_platforms, platforms.size())
    
    return max_platforms
}
```

**Correctness**:
Mit dem Sortieren nach Ankunftszeit gehen wir sicher, dass wir die Züge chronologisch abarbeiten. Der Min-Heap speichert die Abfahrtszeiten aller Züge, die gerade am Bahnhof sind.
Wenn ein neuer Zug ankommt, prüfen wir, ob die früheste Abfahrtszeit im Heap kleiner oder gleich der Ankunftszeit des neuen Zugs ist. Falls ja, ist eine Plattform frei geworden und wir können sie wiederverwenden. Andernfalls brauchen wir eine zusätzliche Plattform.
Die Heap-Größe zu jedem Zeitpunkt gibt an, wie viele Plattformen gerade belegt sind. Die MAXIMALE Heap-Größe während des gesamten Durchlaufs ist die MINIMALE Anzahl an Plattformen, die wir brauchen, um alle Züge bedienen zu können.
Diese eigentlich Greedy-Strategie ist optimal, weil wir Plattformen sofort wiederverwenden, sobald sie frei werden, und nie mehr Plattformen verwenden als tatsächlich gleichzeitig benötigt werden. Für Realismus ließe sich noch ein Puffer zwischen Abfahrt und Ankunft auf den gleichen Gleisen einbauen, aber das ändert nichts am Grundprinzip.

**Running Time**:
Das Sortieren der Züge nach Ankunftszeit mit MergeSort dauert O(n log n). Für jeden der n Züge führen wir maximal eine deleteMin-Operation und genau eine insert-Operation auf dem Heap durch. Beide Operationen kosten jeweils O(log n). Damit ergibt sich für alle Heap-Operationen zusammen O(n log n).
Insgesamt beträgt die Laufzeit O(n log n) + O(n log n) = O(n log n), wie gefordert.
