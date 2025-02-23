#include<bits/stdc++.h>
using namespace std;
#define int long long int

void solve(){
    int n; cin>>n;
    vector<int>v(n-2);
    for(auto &it:v) cin>>it;
    int cnt=0;
    bool ch = false;
    for(int i=0; i<n-2; i++){
        if(v[i]==0){
            cnt++;
        }else{
            if(cnt==1 && ch && cout<<"NO"<<endl) return; 
            ch = true;
            cnt=0;
        }
    }
    cout<<"YES"<<endl;
}

signed main(){
    int t;
    cin>>t;
    while(t--){
        solve();
    }
    return 0;
}