import { db } from "@/lib/db";
import { Book, PlusCircle, Search, LibrarySquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LibraryManagementPage() {
    const books = await db.libraryBook.findMany({
        orderBy: { title: 'asc' }
    });

    const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
                        <LibrarySquare className="w-8 h-8 text-emerald-600" />
                        Library Registry
                    </h1>
                    <p className="text-gray-500">Inventory and book issuance tracking for madrasa students.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-semibold active:scale-95">
                    <PlusCircle className="w-5 h-5" />
                    Add Book
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search books..." className="w-full pl-9 pr-4 py-2 text-sm border-gray-300 rounded-md focus:ring-emerald-500 border outline-none" disabled />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Total Volumes: {totalBooks}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-900/5 text-emerald-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Book Title</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">ISBN</th>
                                <th className="px-6 py-4">Availability</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {books.map((book) => {
                                const ratio = book.availableCopies / book.totalCopies;
                                const isLow = ratio < 0.2;
                                return (
                                    <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {book.title}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-700 font-medium">
                                            {book.author}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            {book.isbn || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${isLow ? 'text-red-600' : 'text-emerald-600'}`}>{book.availableCopies}</span> 
                                                <span className="text-gray-400 text-xs">/ {book.totalCopies}</span>
                                            </div>
                                            <div className="w-24 bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                                <div className={`h-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${ratio * 100}%`}}></div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}

                            {books.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <Book className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                        <p className="font-medium text-gray-900">Library is empty.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
