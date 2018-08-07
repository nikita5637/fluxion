#include <iostream>
#include <iomanip>
#include <string>
#include <math.h>

#define MIN_LENGTH 8

using namespace std;

//#define PRINTTOTAL
#define DIGITONLY
/*#define INCLUDEDATES //ddmmyyyy*/
/*#define INCLUDE3x3  //xxx xxx xxx*/
/*#define INCLUDE4x3 //xxx xxx xxx xxx*/
/*#define INCLUDE2x4 //xxxx xxxx*/
/*#define INCLUDE3x4 //xxxx xxxx xxxx*/
/*#define INCLUDE2x5 //xxxxx xxxxx*/
/*#define INCLUDE3x5 //xxxxx xxxxx xxxxx*/
/*#define SYMBOLS //from xxxxxxxx to xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx(63 symbols)*/
/*#define POPULAR //qwerasdf e.c.*/


/*const string arr[] = {"012", "123", "234", "345", "456", "567", "678", "789", "890",
                      "qwe", "wer", "ert", "rty", "tyu", "yui", "uio", "iop", "op[", "p[]",
                      "][p", "[po","poi","oiu","iuy","uyt","ytr","tre","rew","ewq",
                      "asd", "sdf", "dfg", "fgh", "ghj", "hjk", "jkl", "kl;", "l;'",
                      "';l", ";lk", "lkj", "kjh", "jhg", "hgf" ,"gfd" , "fds", "dsa",
                      "zxc", "xcv", "cvb", "vbn", "bnm", "nm,", "m,.", ",./",
                      "/.,",".,m",",mn","mnb","nbv","bvc","vcx","cxz",
                      "1qa","qaz","2ws","wsx","3ed","edc","4rf","rfv","5tg","tgb",
                      "zaq","aq1","xsw","sw2","cde","de3","vfr","fr4","bgt","gt5",
                      "6yh","yhn","7uj","ujm","8ik","ik,","9ol","ol.","0p;","p;/",
                      "nhy","hy6","mju","ju7",",ki","ki8",".lo","lo9","/;p",";p0",*/

const string popular[] = {"1234","2345","3456","4567","5678","6789","7890","0123",
			"12345", "23456", "34567", "45678", "56789", "67890", "012345"
                      "3210","4321","5432","6543","7654","8765","9876","0987",
			"43210", "54321", "65432", "76543", "87654", "98765", "09876",
                      "qwer","wert","erty","rtyu","tyui","yuio","uiop","iop[","op[]",
			"qwert", "werty", "ertyu", "rtyui", "tyuio", "yuiop", "uiop[", "iop[]",
                      "][po","[poi","poiu","oiuy","iuyt","uytr","ytre","trew","rewq",
			"][poi", "[poiu", "poiuy", "oiuyt", "iuytr", "uytre", "ytrew", "trewq",
                      "asdf","sdfg","dfgh","fghj","ghjk","hjkl","jkl;","kl;'",
			"asdfg", "sdfgh", "dfghj", "fghjk", "ghjkl", "hjkl;", "jkl;'",
                      "';lk",";lkj","lkjh","kjhg","jhgf","hgfd","gfds","fdsa",
			"';lkj", ";lkjh", "lkjhg", "kjhgf", "jhgfd", "hgfds", "gfdsa",
                      "zxcv","xcvb","cvbn","vbnm","bnm,","nm,.","m,./",
			"zxcvb", "xcvbn", "cvbnm", "vbnm,", "bnm,.", "nm,./",
                      "/.,m",".,mn",",mnb","mnbv","nbvc","bvcx","vcxz",
			"/.,mn", ".,mnb", ",mnbv", "mnbvc", "nbvcx", "bvcxz",
                      "1qaz", "2wsx","3edc","4rfv","5tgb","6yhn","7ujm","8ik,","9ol.","0p;/",
                      "zaq1", "xsw2","cde3","vfr4","bgt5","nhy6","mju7",",ki8,",".lo9.","/;p0"
                     };

void generator() {
    unsigned int sizearr = 0;
    unsigned int total = 0;

#ifdef DIGITONLY
	for(int i = 0; i < pow(10, MIN_LENGTH); i++) {
		cout << setfill('0') << setw(MIN_LENGTH) << i << endl;
	}
#endif /* DIGITONLY */

#ifdef INCLUDEDATES
	for (int y = 1900; y <= 2050; y++) {
		for (int m = 1; m <= 12; m++) {
			for (int d = 1; d <= 31; d++) {
				if (d < 10 && m < 10)
					cout << "0" << d << "0" << m << y << endl;
				else if (d < 10 && m > 9)
					cout << "0" << d << m << y << endl;
				else if (d > 9 && m < 10)
					cout << d << "0" << m << y << endl;
				else cout << d << m << y << endl;
				total++;
			}
		}
	}
#endif

#ifdef INCLUDE3x3
	for (int i = 0; i <= 9; i++) {
		for (int j = 0; j <= 9; j++) {
			for (int k = 0; k <= 9; k++) {
				cout << i << j << k << i << j << k << i << j << k << endl;
				total++;
			}
		}
	}
#endif

#ifdef INCLUDE4x3
	for (int i = 0; i <= 9; i++) {
		for (int j = 0; j <= 9; j++) {
			for (int k = 0; k <= 9; k++) {
				cout << i << j << k << i << j << k << i << j << k << i << j << k << endl;
				total++;
			}
		}
	}
#endif

#ifdef INCLUDE2x4
	for (int i = 0; i <= 9; i++) {
		for (int j = 0; j <= 9; j++) {
			for (int k = 0; k <= 9; k++) {
				for (int l = 0; l <= 9; l++) {
					cout << i << j << k << l << i << j << k << l << endl;
					total++;
				}
			}
		}
	}
#endif

#ifdef INCLUDE3x4
	for (int i = 0; i <= 9; i++) {
		for (int j = 0; j <= 9; j++) {
			for (int k = 0; k <= 9; k++) {
				for (int l = 0; l <= 9; l++) {
					cout << i << j << k << l << i << j << k << l << i << j << k << l << endl;
					total++;
				}
			}
		}
	}
#endif

#ifdef INCLUDE2x5
	for (int i = 0; i <= 9; i++) {
		for (int j = 0; j <= 9; j++) {
			for (int k = 0; k <= 9; k++) {
				for (int l = 0; l <= 9; l++) {
					for (int m = 0; m <= 9; m++) {
						cout << i << j << k << l << m << i << j << k << l << m << endl;
						total++;
					}
				}
			}
		}
	}
#endif

#ifdef INCLUDE3x5
	for (int i = 0; i <= 9; i++) {
		for (int j = 0; j <= 9; j++) {
			for (int k = 0; k <= 9; k++) {
				for (int l = 0; l <= 9; l++) {
					for (int m = 0; m <= 9; m++) {
						cout << i << j << k << l << m << i << j << k << l << m << i << j << k << l << m << endl;
						total++;
					}
				}
			}
		}
	}
#endif

#ifdef SYMBOLS
	for (int i = 32; i <= 126; i++) {
		int e = 8;
		int w = 1;
		string s = "";
		while ((w <= e) && (e <= 63)) {
			s += (char)(i);
			if (w == e) {
				e++;
				w = 0;
				cout << s << endl;;
				total++;
				s = "";
			}
			w++;
		}
	}
#endif

#ifdef POPULAR
	sizearr = (sizeof(popular) / sizeof(popular[0]));
	for (int i = 0; i < sizearr; i++) {
		for (int j = 0; j < sizearr; j++) {
				cout << popular[i] << popular[j] << endl;
				total++;
		}
	}
#endif

#ifdef PRINTTOTAL
	cout << "TOTAL: " << total << endl;
#endif
}

int main() {
    generator();
    return 0;
}

